import { FandomUser, FandomUserSet } from './FandomUser';
import { FandomWiki } from './FandomWiki';
import { FetchManager, FetchManagerOptions } from '../../util/FetchManager';
import { RequestInit } from 'node-fetch';
import {
	UserDetails,
	UserDetailsResult,
	WikiDetails,
	WikiDetailsResult
} from '../../interfaces/Fandom';
import { WikiNetwork } from '../WikiNetwork';

interface Fandom extends WikiNetwork {
	getUser( name : string|number ) : FandomUser;
	getUsers( name : (string|number)[] ) : FandomUserSet;
};

class Fandom extends WikiNetwork {
	public static readonly REGEXP_DOMAIN = /\.(?:fandom\.com|\wikia\.(?:com|org))$/
	public static readonly REGEXP_LANG = /^[a-z]{2}(?:-[a-z]{2,})?$/
	public static readonly REGEXP_WIKI = /^(?:([a-z]{2}(?:-[a-z]{2,})?)\.)?([a-z0-9-_]+)$/

	public readonly central : FandomWiki;

	public constructor( fetchManager? : FetchManager|FetchManagerOptions, requestOptions? : RequestInit ) {
		super( 'Fandom', fetchManager, requestOptions );
		this.central = this.getWiki( 'community' );

		this.getUser = this.central.getUser.bind( this.central );
		this.getUsers = this.central.getUsers.bind( this.central );
	}

	public getWiki( wiki : string ) : FandomWiki {
		let url;
		try {
			url = new URL( !wiki.startsWith( 'http://' ) && !wiki.startsWith( 'https://' ) ? `https://${wiki}` : wiki );
		} catch {}

		if ( url && Fandom.REGEXP_DOMAIN.test( url.hostname ) ) {
			let entrypoint = url.origin;

			const path = url.pathname.split( '/' );
			if ( path.length > 1 && Fandom.REGEXP_LANG.test( path[1] ) ) {
				entrypoint += `/${path[1]}`;
			}

			return new FandomWiki( this, entrypoint, this.fetchManager, this.requestOptions );
		}

		const match = wiki.match( Fandom.REGEXP_WIKI );
		if ( match ) {
			return new FandomWiki( this, `https://${match[2]}.fandom.com${match[1] ? `/${match[1]}` : ''}`, this.fetchManager, this.requestOptions );
		}

		throw new Error( 'Specified wiki is not on the Fandom network.' );
	}

	public async getUserDetails( ids : number|number[] ) : Promise<UserDetails[]> {
		if ( !Array.isArray( ids ) ) {
			ids = [ ids ];
		}

		return ( await this.central.callNirvana<UserDetailsResult>( {
			controller: 'UserApiController',
			method: 'GetDetails',
			ids: ids.join( ',' )
		} ) ).items;
	}

	public async getWikiDetails( ids : number|number[] ) : Promise<{ [ id : number ] : WikiDetails }> {
		if ( !Array.isArray( ids ) ) {
			ids = [ ids ];
		}

		return ( await this.central.callNirvana<WikiDetailsResult>( {
			controller: 'WikisApiController',
			method: 'GetDetails',
			ids: ids.join( ',' )
		} ) ).items;
	}
};

export { Fandom };
