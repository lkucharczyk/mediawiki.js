import { FandomWiki, FandomWikiComponents } from './FandomWiki';
import { FetchManager, FetchManagerOptions } from '../../util/FetchManager';
import { RequestInit } from 'node-fetch';
import { WikiNetwork, WikiNotOnNetworkError } from '../WikiNetwork';
import { Loaded } from '../UncompleteModel';

interface Fandom extends WikiNetwork {
	getUser: FandomWiki['getUser'],
	getUsers: FandomWiki['getUsers']
};

class Fandom extends WikiNetwork {
	public static readonly REGEXP_DOMAIN = /\.(?:fandom\.com|gamepedia\.com|\wikia\.(?:com|org))$/;
	public static readonly REGEXP_LANG = /^[a-z]{2,3}(?:-[a-z]{2,})?$/;
	public static readonly REGEXP_WIKI = /^(?:([a-z]{2,3}(?:-[a-z]{2,})?)\.)?([a-z0-9-_]+)$/;

	public readonly central: FandomWiki;
	protected readonly services: FandomWiki;

	public constructor( fetchManager?: FetchManager|FetchManagerOptions, requestOptions?: RequestInit ) {
		super( 'Fandom', fetchManager, requestOptions );
		this.central = this.getWiki( 'community' );
		this.services = this.getWiki( 'services' );

		this.getUser = this.central.getUser.bind( this.central );
		this.getUsers = this.central.getUsers.bind( this.central );
	}

	public static normalizeURL( wiki: string ): string {
		let url;
		try {
			url = new URL( !wiki.startsWith( 'http://' ) && !wiki.startsWith( 'https://' ) ? `https://${ wiki }` : wiki );
		} catch {}

		if ( url && Fandom.REGEXP_DOMAIN.test( url.hostname ) ) {
			let entrypoint = url.origin;

			const path = url.pathname.split( '/' );
			if ( path.length > 1 && Fandom.REGEXP_LANG.test( path[1] ) ) {
				entrypoint += `/${ path[1] }`;
			}

			return entrypoint;
		}

		const match = wiki.match( Fandom.REGEXP_WIKI );
		if ( match ) {
			return `https://${ match[2] }.fandom.com${ match[1] ? `/${ match[1] }` : '' }`;
		}

		throw new WikiNotOnFandomError();
	}

	public async callServices( path: string, params?: Record<string, string>, options?: RequestInit ) {
		return this.services.call( path, params, options ).then( async r => r.json() );
	}

	public getWiki( wiki: string ): FandomWiki;
	public getWiki<const T extends FandomWikiComponents>( wiki: T ): Loaded<FandomWiki, keyof T & keyof FandomWiki>;
	public getWiki( wiki: string | FandomWikiComponents ): FandomWiki {
		if ( typeof wiki === 'string' ) {
			return new FandomWiki( this, Fandom.normalizeURL( wiki ), this.fetchManager, this.requestOptions );
		} else {
			wiki.url = Fandom.normalizeURL( wiki.url );
			return new FandomWiki( this, wiki.url ).fromJSON( wiki );
		}
	}

	public async getWikiById( id: number ): Promise<Loaded<FandomWiki, 'id'>|null> {
		return this.getWikisById( [ id ] ).then( o => o[id] );
	}

	public async getWikisById<T extends number>( ids: readonly T[] ): Promise<{ [ id in T ]: Loaded<FandomWiki, 'id'>|null }> {
		const items = ( await this.central.callNirvana( {
			controller: 'WikisApi',
			method: 'getDetails',
			ids
		} ) ).items;

		return Object.fromEntries( ids.map( id => {
			const item = items[id];

			if ( item !== undefined ) {
				const wiki = this.getWiki( item.url );

				wiki.id = id;
				wiki.lang = item.lang;
				wiki.name = item.name;
				wiki.server = item.url;

				wiki.setLoaded( [ 'id', 'lang', 'name', 'server' ] );

				return [ id, wiki ];
			} else {
				return [ id, null ];
			}
		} ) ) as { [ id in T ]: Loaded<FandomWiki, 'id'>|null };
	}
};

export { Fandom };

export class WikiNotOnFandomError extends WikiNotOnNetworkError {
	public constructor() {
		super( 'Fandom' );
	}
};
