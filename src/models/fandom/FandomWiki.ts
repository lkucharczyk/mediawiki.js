import { Fandom } from './Fandom';
import { FandomUser } from './FandomUser';
import { FandomUserSet } from './FandomUserSet';
import { FetchManager, FetchManagerOptions, uniqueArray } from '../../util/util';
import { MercuryWikiVariables, MercuryWikiVariablesResult, NirvanaResult } from '../../interfaces/Fandom';
import { RequestInit } from 'node-fetch';
import { Wiki } from '../Wiki';

export class FandomWiki extends Wiki {
	public static readonly COMPONENTS_MERCURYWIKIVARIABLES = [ 'articlepath', 'id', 'lang', 'name', 'scriptpath', 'server', 'vertical' ];
	public static readonly COMPONENTS_WIKIDETAILS = [ 'founder', 'foundingdate', 'lang', 'name', 'server', 'vertical' ];
	public static readonly COMPONENTS = uniqueArray( Wiki.COMPONENTS, FandomWiki.COMPONENTS_MERCURYWIKIVARIABLES, FandomWiki.COMPONENTS_WIKIDETAILS );

	public readonly network : Fandom;

	public founder? : FandomUser;
	public foundingdate? : string;
	public id? : number;
	public vertical? : string;

	#mercuryWikiVariables? : MercuryWikiVariables;

	constructor( network : Fandom, entrypoint : string, fetchManager? : FetchManager|FetchManagerOptions, requestOptions? : RequestInit ) {
		super( entrypoint, fetchManager, requestOptions );
		this.network = network;
	}

	public async callNirvana<T extends NirvanaResult = NirvanaResult>( params : Record<string, string> & { controller : string, method? : string }, options? : RequestInit ) : Promise<T> {
		params.format = 'json';
		return ( await this.call( 'wikia.php', params, options ) ).json();
	}

	public async getMercuryWikiVariables() : Promise<MercuryWikiVariables> {
		if ( !this.#mercuryWikiVariables ) {
			this.#mercuryWikiVariables = ( await this.callNirvana<MercuryWikiVariablesResult>( {
				controller: 'MercuryApiController',
				method: 'getWikiVariables'
			} ) ).data;
		}

		return this.#mercuryWikiVariables;
	}

	public getUser( name : string|number ) : FandomUser {
		return new FandomUser( name, this );
	}

	public getUsers( names : (string|number)[] ) : FandomUserSet {
		return new FandomUserSet( names.map( e => this.getUser( e ) ) );
	}

	protected async __load( components : string[] ) : Promise<void> {
		const loadWikiDetails = components.find( e => FandomWiki.COMPONENTS_WIKIDETAILS.includes( e ) )
		if ( !this.id && loadWikiDetails ) {
			components.push( 'id' );
		}

		if ( components.find( e => FandomWiki.COMPONENTS_MERCURYWIKIVARIABLES.includes( e ) ) ) {
			const mwv = await this.getMercuryWikiVariables();

			this.articlepath = mwv.articlePath + '$1';
			this.id = mwv.id;
			this.lang = mwv.language.content;
			this.name = mwv.siteName;
			this.server = mwv.basePath;
			this.scriptpath = mwv.scriptPath;
			this.vertical = mwv.vertical;

			this.setLoaded( FandomWiki.COMPONENTS_MERCURYWIKIVARIABLES );
			components = components.filter( e => !FandomWiki.COMPONENTS_MERCURYWIKIVARIABLES.includes( e ) );
		}

		if ( this.id && loadWikiDetails ) {
			const details = ( await this.network.getWikiDetails( this.id ) )[this.id];

			const founderID = Number.parseInt( details.founding_user_id );
			if ( founderID >= 0 ) {
				this.founder = this.getUser( founderID );
			}

			this.foundingdate = details.creation_date;
			this.lang = details.lang;
			this.name = details.name;
			this.server = `https://${ details.domain }`;
			this.vertical = details.hub;

			this.setLoaded( FandomWiki.COMPONENTS_WIKIDETAILS );
			components = components.filter( e => !FandomWiki.COMPONENTS_WIKIDETAILS.includes( e ) );
		}

		if ( components.length ) {
			return super.__load( components );
		}
	}

	public clear() : void {
		this.id = undefined;
		this.lang = undefined;
		this.#mercuryWikiVariables = undefined;

		super.clear();
	}
};
