import { Fandom } from './Fandom';
import { FandomUser, FandomUserComponents, FandomUserSet } from './FandomUser';
import { chunkArray, FetchManager, FetchManagerOptions } from '../../util/util';
import { Headers, RequestInit } from 'node-fetch';
import { UncompleteModelSet } from '../UncompleteModelSet';
import { Wiki, WikiComponents } from '../Wiki';
import { FandomFamily } from './FandomFamily';
import { Loaded, UncompleteModelLoaderT } from '../UncompleteModel';
import {
	ApiQueryListAllusers,
	ApiQueryMetaSiteinfo,
	KnownNirvanaRequests,
	KnownNirvanaResponses,
	NirvanaErrorResponse,
	NirvanaRequestBase,
	NirvanaResponse
} from '../../../types/types';
import { NirvanaError } from './NirvanaError';
import { GetSubmodel, submodel } from '../../util/submodel';

interface FandomWikiComponents extends WikiComponents {
	id?: number,
	vertical?: string
}

type FandomWikiLoader<C extends keyof FandomWikiComponents, D extends keyof FandomWikiComponents|never = never> = UncompleteModelLoaderT<FandomWiki, C, D>;

interface FandomWiki extends FandomWikiComponents {
	siteinfo?: ApiQueryMetaSiteinfo.PropGeneral & { gamepedia?: 'true'|'false' };
	callNirvana<P extends KnownNirvanaRequests>( params: Readonly<P>, options?: RequestInit ): Promise<KnownNirvanaResponses<P>>;
	load<T extends keyof FandomWikiComponents>( ...components: T[] ): Promise<Loaded<this, T>>;
	load<T extends keyof FandomWikiComponents, D extends keyof FandomWikiComponents>( loader: FandomWikiLoader<T, D> ): Promise<Loaded<this, T|D>>;
	setLoaded( components: keyof FandomWikiComponents|( keyof FandomWikiComponents )[] ): void;

	getUser: GetSubmodel<FandomUser, FandomUserComponents, 'name'>;
	// fetchUsers: FetchSubmodels<( typeof FandomUser )['fetch']>;
	fetchUsers<C extends 'groups'|never = never>( criteria?: ApiQueryListAllusers.Criteria, components?: C[] ): Promise<Loaded<FandomUser, 'id'|'name'|C>[]>;
};

@submodel<typeof FandomWiki, typeof FandomUser, FandomUserComponents>( FandomUser, 'User' )
class FandomWiki extends Wiki {
	public readonly network: Fandom;
	declare public family?: FandomFamily;

	constructor( network: Fandom, entrypoint: string, fetchManager?: FetchManager|FetchManagerOptions, requestOptions?: RequestInit ) {
		super( entrypoint, fetchManager, requestOptions );
		this.articlepath = '/wiki/$1';
		this.network = network;
		this.server = this.url;
	}

	public async callNirvanaUnknown<T extends NirvanaResponse = NirvanaResponse>( params: NirvanaRequestBase, options?: RequestInit ): Promise<T> {
		for ( const key in params ) {
			if ( typeof params[key] === 'object' && params[key]?.toString() === '[object Object]' ) {
				params[key] = JSON.stringify( params[key] );
			}
		}

		if ( options?.method === 'POST' && options?.body === undefined ) {
			options ??= {};
			options.body = new URLSearchParams();
			for ( const key in params ) {
				if ( key !== 'controller' && key !== 'method' ) {
					options.body.append( key, params[key]?.toString() ?? '' );
					delete params[key];
				}
			}

			options.headers = options.headers instanceof Headers
				? options.headers
				: new Headers( options.headers );
			options.headers.set( 'Content-Type', 'application/x-www-form-urlencoded' );
		}

		params.format = 'json';
		return this.call( 'wikia.php', this.processApiParams( params as unknown as Record<string, Exclude<NirvanaRequestBase[string], Record<string, unknown>>>, ',' ), options )
			.then( async r => r.json() as Promise<T|NirvanaErrorResponse> )
			.then( r => {
				if ( 'error' in r && r.error !== undefined ) {
					throw new NirvanaError( r );
				}

				return r;
			} );
	}

	public getKey(): string {
		const url = new URL( this.url );

		const domain = url.hostname.replace( Fandom.REGEXP_DOMAIN, '' );
		const lang = url.pathname.split( '/' )[1] ?? '';

		return lang !== 'en' && Fandom.REGEXP_LANG.test( lang )
			? `${ lang }.${ domain }`
			: domain;
	}

	public getFamily( strict: boolean = true ): FandomFamily {
		if ( !this.family ) {
			this.family = new FandomFamily( this, strict );
		}

		return this.family;
	}

	public getUsers( names: ( string|number )[] ): FandomUserSet {
		return new FandomUserSet( names.map( e => this.getUser( e ) ) );
	}

	public clear(): void {
		this.id = undefined;
		this.lang = undefined;

		super.clear();
	}
};

FandomWiki.prototype.callNirvana = FandomWiki.prototype.callNirvanaUnknown;

interface FandomWikiSet {
	load<T extends keyof FandomWikiComponents>( ...components: T[] ): Promise<this & { models: Loaded<FandomWiki, T>[] }>;
};

class FandomWikiSet extends UncompleteModelSet<FandomWiki> {
};

// MercuryWikiVariables loader
export const FandomWikiMWVLoader = {
	components: [ 'articlepath', 'id', 'lang', 'name', 'scriptpath', 'server', 'vertical' ],
	async load( wiki: FandomWiki ) {
		return wiki.callNirvana( {
			controller: 'MercuryApi',
			method: 'getWikiVariables'
		} ).then( res => {
			wiki.articlepath = res.data.articlePath + '$1';
			wiki.id = res.data.id;
			wiki.lang = res.data.language.content;
			wiki.name = res.data.siteName.replace( ' | Fandom', '' );
			wiki.server = res.data.basePath;
			wiki.scriptpath = res.data.scriptPath;
			wiki.vertical = res.data.vertical;

			return this.components;
		} );
	}
};

// WikiDetails loader
export const FandomWikiWDLoader: UncompleteModelLoaderT<FandomWiki, 'lang'|'name'|'server', 'id'> = {
	components: [ 'lang', 'name', 'server' ],
	dependencies: [ 'id' ],
	async load( set: FandomWiki|FandomWikiSet ) {
		const models = set instanceof FandomWiki ? [ set ] : set.models;
		const chunks = chunkArray( models.map( e => e.id ).filter( e => e !== undefined ) as number[], 250 );

		return Promise.all( chunks.map( async ids =>
			models[0].callNirvana( {
				controller: 'WikisApi',
				method: 'getDetails',
				ids
			} ).then( result => {
				for ( const _id in result.items ) {
					const id = Number.parseInt( _id );
					const details = result.items[id];

					const wiki = models.find( e => e.id === id );
					if ( wiki && details ) {
						wiki.lang = details.lang;
						wiki.name = details.name;
						wiki.server = details.url;
					}
				}
			} )
		) ).then( () => this.components );
	}
};

FandomWiki.registerLoader( ...Wiki.LOADERS, FandomWikiMWVLoader, FandomWikiWDLoader );
FandomWikiSet.registerLoader( FandomWikiWDLoader );

export { FandomWiki, FandomWikiSet };
export type { FandomWikiComponents, FandomWikiLoader };
