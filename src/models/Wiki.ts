import {
	ApiErrorResponse,
	ApiQueryMetaSiteinfoPropGeneral,
	ApiQueryMetaSiteinfoPropInterwikimap,
	ApiQueryMetaSiteinfoPropNamespaces,
	ApiQueryMetaSiteinfoProps,
	ApiQueryMetaSiteinfoPropStatistics,
	ApiRequestBase,
	ApiRequestResponse,
	KnownApiRequests,
} from '../../types/types';
import { FetchManager, FetchManagerOptions } from '../util/FetchManager';
import { FetchError, Headers, RequestInit, Response } from 'node-fetch';
import { Loaded, UncompleteModel } from './UncompleteModel';
import { UncompleteModelSet } from './UncompleteModelSet';
import { WikiFamily } from './WikiFamily';
import { WikiNetwork } from './WikiNetwork';
import { WikiUser, WikiUserComponents, WikiUserSet } from './WikiUser';
import { WikiApiError } from './WikiApiError';
import { isIterable } from '../util/util';
import { FetchSubmodels, GetSubmodel, submodel } from '../util/submodel';
import { WikiPage, WikiPageComponents } from './WikiPage';
import FormData from 'form-data';

interface WikiComponents {
	articlepath? : string;
	generator? : string;
	interwikimap? : ApiQueryMetaSiteinfoPropInterwikimap;
	lang? : string;
	name? : string;
	namespaces?: ApiQueryMetaSiteinfoPropNamespaces;
	server? : string;
	scriptpath? : string;
	siteinfo? : ApiQueryMetaSiteinfoPropGeneral;
	statistics? : ApiQueryMetaSiteinfoPropStatistics;
	url? : string;
};

interface Wiki extends WikiComponents {
	callApi<P extends KnownApiRequests>( params : Readonly<P>, options? : RequestInit ) : Promise<ApiRequestResponse<P>>;
	load<T extends keyof WikiComponents>( ...components : T[] ) : Promise<Loaded<this, T>>;
	setLoaded( components : keyof WikiComponents|( keyof WikiComponents )[] ) : void;

	getPage: GetSubmodel<WikiPage, WikiPageComponents, 'title'>;
	getUser: GetSubmodel<WikiUser, WikiUserComponents, 'name'>;
	fetchPages: FetchSubmodels<( typeof WikiPage )['fetch']>;
	fetchUsers: FetchSubmodels<( typeof WikiUser )['fetch']>;
};

@submodel<typeof Wiki, typeof WikiPage, WikiPageComponents>( WikiPage, 'page' )
@submodel<typeof Wiki, typeof WikiUser, WikiUserComponents>( WikiUser, 'user' )
class Wiki extends UncompleteModel {
	public readonly entrypoint : string;
	public family? : WikiFamily;
	public network? : WikiNetwork;
	public requestOptions : RequestInit;

	public url: string;

	protected readonly fetchManager : FetchManager;

	/** @param entrypoint api.php entry point */
	public constructor( entrypoint : string, fetchManager? : FetchManager|FetchManagerOptions, requestOptions? : RequestInit ) {
		super();
		this.entrypoint = Wiki.normalizeURL( entrypoint );
		this.url = this.entrypoint;
		this.fetchManager = fetchManager instanceof FetchManager
			? fetchManager
			: new FetchManager( Object.assign( { name: entrypoint }, fetchManager ) );
		this.requestOptions = requestOptions ?? {};
	}

	public static normalizeURL( url : string ) : string {
		if ( url.includes( '?' ) ) {
			url = url.substring( 0, url.lastIndexOf( '?' ) );
		}

		if ( url.includes( '#' ) ) {
			url = url.substring( 0, url.lastIndexOf( '#' ) );
		}

		if ( url.endsWith( '.php' ) || url.endsWith( '/$1' ) || url.endsWith( '/' ) ) {
			url = url.substring( 0, url.lastIndexOf( '/' ) );
		}

		if ( /\/w(iki)?(\/.*)?$/.test( url ) ) {
			url = url.replace( /\/w(iki)?(\/.*)?$/, '' );
		}

		return url;
	}

	public async call( path? : string, params? : Record<string, string>, options? : RequestInit ) : Promise<Response> {
		const requestOptions = Object.assign( {}, this.requestOptions, options );
		if ( typeof this.requestOptions?.headers === 'object' && typeof options?.headers === 'object' ) {
			requestOptions.headers = Object.assign( {}, this.requestOptions.headers, options.headers );
		}

		return this.fetchManager.queue( this.getURL( path, params ), requestOptions );
	}

	protected processApiParams( params : Record<string, ApiRequestBase[string]>, arraySeparator : string = '|' ) : Record<string, string> {
		const out : Record<string, string> = {};

		for ( const key in params ) {
			const val = params[key];

			if ( Array.isArray( val ) ) {
				out[key] = val.join( arraySeparator );
			} else if ( val instanceof Date ) {
				out[key] = val.toJSON();
			} else if ( val !== undefined && val !== null ) {
				out[key] = val.toString();
			}
		}

		return out;
	}

	public async callApiUnknown<P extends ApiRequestBase = ApiRequestBase, R = ApiRequestResponse<P>>( params : Readonly<P>, options? : RequestInit ) : Promise<R> {
		Object.assign( params, {
			format: 'json',
			formatversion: 2
		} );

		let callParams : Record<string, string> = this.processApiParams( params );
		options = options ?? {};

		if ( options?.method === 'POST' ) {
			if ( options?.body === undefined ) {
				options.body = new URLSearchParams( callParams ).toString();
				options.headers ??= {};

				if ( options.headers instanceof Headers ) {
					options.headers.set( 'Content-Type', 'application/x-www-form-urlencoded' );
				} else if ( Array.isArray( options.headers ) ) {
					options.headers.push( [ 'Content-Type', 'application/x-www-form-urlencoded' ] );
				} else if ( !isIterable( options.headers ) ) {
					options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
				}

				callParams = {};
			} else if ( options.body instanceof FormData ) {
				for ( const key in params ) {
					options.body.append( key, params[key] )
				}
			}

			callParams = {};
		}

		return this.call( 'api.php', callParams, options )
			.then( r => r.json().catch( e =>{
				throw e instanceof FetchError ? Object.assign( e, { response: r } ) : e
			} ) as Promise<R|ApiErrorResponse> )
			.then( r => {
				if ( 'error' in r ) {
					throw new WikiApiError( r );
				}

				return r;
			} );
	}

	public async callIndex( params : string|Record<string, string>, options? : RequestInit ) : Promise<Response> {
		if ( typeof params === 'string' ){
			params = { title: params };
		}

		return this.call( 'index.php', params, options );
	}

	public async getEditToken() : Promise<string> {
		const res = await this.callApi( {
			action: 'query',
			meta: 'tokens',
			type: 'csrf',
		} );

		return res.query.tokens.csrftoken;
	}

	getURL( path = '', params? : Record<string, string> ) : string {
		const base : string = this.scriptpath && this.server
			? this.server + this.scriptpath
			: this.url;

		return encodeURI( `${ base }/${ path }` ) + ( params ? `?${( new URLSearchParams( params ) ).toString()}` : '' );
	}

	getWikiURL( path = '', params? : Record<string, string> ) : string {
		const base : string = this.articlepath && this.server
			? this.server + this.articlepath
			: `${ this.url }/$1`;

		return base.replace( '$1', encodeURIComponent( path.replace( / /g, '_' ) ) ) + ( params ? `?${( new URLSearchParams( params ) ).toString()}` : '' );
	}

	public getFamily( strict : boolean = true ) : WikiFamily {
		if ( !this.family ) {
			this.family = new WikiFamily( this, strict );
		}

		return this.family;
	}

	public getUsers( names : (string|number)[] ) : WikiUserSet {
		return new WikiUserSet( names.map( e => this.getUser( e ) ) );
	}
}

Wiki.prototype.callApi = Wiki.prototype.callApiUnknown;

interface WikiSet {
	load<T extends keyof WikiComponents>( ...components : T[] ) : Promise<this & { models: Loaded<Wiki, T>[] }>;
};

class WikiSet<T extends Wiki = Wiki> extends UncompleteModelSet<T> {
};

Wiki.registerLoader( {
	components: [ 'articlepath', 'generator', 'interwikimap', 'lang', 'name', 'namespaces', 'server', 'scriptpath', 'siteinfo', 'statistics', 'url' ],
	async load( set : Wiki|UncompleteModelSet<Wiki>, components : string[] ) {
		const models : Wiki[] = set instanceof Wiki ? [ set ] : set.models;

		const load : ApiQueryMetaSiteinfoProps[] = [ 'general' ];

		if ( components.includes( 'interwikimap' ) ) {
			load.push( 'interwikimap' );
		}

		if ( components.includes( 'namespaces' ) ) {
			load.push( 'namespaces' );
		}

		if ( components.includes( 'statistics' ) ) {
			load.push( 'statistics' );
		}

		await Promise.all( models.map( model =>
			model.callApi( {
				action: 'query',
				meta: 'siteinfo',
				siprop: load
			} ).then( si => {
				if ( 'general' in si.query ) {
					function genDescriptor<T extends object>( obj : T, key : keyof T ) : PropertyDescriptor {
						return {
							configurable: true,
							enumerable: true,
							get() {
								return obj[key];
							},
							set( v ) {
								obj[key] = v;
							}
						};
					};

					model.siteinfo = si.query.general;
					model.url = Wiki.normalizeURL( model.siteinfo.server + model.siteinfo.scriptpath );

					Object.defineProperties( model, {
						articlepath: genDescriptor( model.siteinfo, 'articlepath' ),
						generator: genDescriptor( model.siteinfo, 'generator' ),
						lang: genDescriptor( model.siteinfo, 'lang' ),
						name: genDescriptor( model.siteinfo, 'sitename' ),
						server: genDescriptor( model.siteinfo, 'server' ),
						scriptpath: genDescriptor( model.siteinfo, 'scriptpath' ),
					} );
				}

				if ( 'interwikimap' in si.query ) {
					model.interwikimap = si.query.interwikimap;
				}

				if ( 'namespaces' in si.query ) {
					model.namespaces = si.query.namespaces;
				}

				if ( 'statistics' in si.query ) {
					model.statistics = si.query.statistics;
				}
			} )
		) );

		return this.components.filter( ( c : string ) => ![ 'interwikimap', 'sitemap' ].includes( c ) || components.includes( c ) );
	}
} );

export { Wiki, WikiSet };
export type { WikiComponents };
