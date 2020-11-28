import {
	ApiQueryInterwikiMapResult,
	ApiQuerySiteinfoProp,
	ApiQuerySiteinfoResult,
	ApiQueryStatisticsResult,
	ApiQueryToken,
	ApiResult,
	ApiStatistics,
	Interwiki
} from '../interfaces/Api';
import { FetchManager, FetchManagerOptions } from '../util/FetchManager';
import { RequestInit, Response } from 'node-fetch';
import { UncompleteModel } from './UncompleteModel';
import { UncompleteModelSet } from './UncompleteModelSet';
import { WikiFamily } from './WikiFamily';
import { WikiNetwork } from './WikiNetwork';
import { WikiUser, WikiUserSet } from './WikiUser';

export class Wiki extends UncompleteModel {
	public readonly entrypoint : string;
	public family? : WikiFamily;
	public network? : WikiNetwork;
	public requestOptions : RequestInit;

	public articlepath? : string;
	public generator? : string;
	public interwikimap? : Interwiki[];
	public lang? : string;
	public name? : string;
	public server? : string;
	public scriptpath? : string;
	public statistics? : ApiStatistics;
	public url : string;

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

	public async callApi<T extends ApiResult = ApiResult>( params : Record<string, string>, options? : RequestInit ) : Promise<T> {
		params.format = 'json';

		if ( options?.method === 'POST' && options?.body === undefined ) {
			options = options ?? {};
			options.headers = options.headers ?? {};

			options.body = new URLSearchParams( params ).toString();
			params = {};
			Object.assign( options.headers, { 'Content-Type': 'application/x-www-form-urlencoded' } );
		}

		return ( await this.call( 'api.php', params, options ) ).json();
	}

	public async callIndex( params : string|Record<string, string>, options? : RequestInit ) : Promise<Response> {
		if ( typeof params === 'string' ){
			params = { title: params };
		}

		return this.call( 'index.php', params, options );
	}

	public async getSiteinfo<T extends ApiQuerySiteinfoProp[]>( props : T ) : Promise<
		( 'general'      extends T[number] ? ApiQuerySiteinfoResult     : {} ) &
		( 'interwikimap' extends T[number] ? ApiQueryInterwikiMapResult : {} ) &
		( 'statistics'   extends T[number] ? ApiQueryStatisticsResult   : {} )
	> {
		return this.callApi( {
			action: 'query',
			meta: 'siteinfo',
			siprop: props.join( '|' )
		} );
	}

	public async getEditToken() : Promise<string> {
		const res = await this.callApi<ApiQueryToken>( {
			action: 'query',
			prop: 'info',
			intoken: 'edit',
			titles: 'Main_Page'
		} );

		return Object.values( res.query.pages )[0].edittoken;
	}

	getURL( path = '', params? : any ) : string {
		const base : string = this.scriptpath && this.server
			? this.server + this.scriptpath
			: this.url;

		return encodeURI( `${ base }/${ path }` ) + ( params ? `?${( new URLSearchParams( params ) ).toString()}` : '' );
	}

	getWikiURL( path = '', params? : any ) : string {
		const base : string = this.articlepath && this.server
			? this.server + this.articlepath
			: `${ this.url }/$1`;

		return encodeURI( base.replace( '$1', encodeURIComponent( path.replace( / /g, '_' ) ) ) ) + ( params ? `?${( new URLSearchParams( params ) ).toString()}` : '' );
	}

	public getFamily( strict : boolean = true ) : WikiFamily {
		if ( !this.family ) {
			this.family = new WikiFamily( this, strict );
		}

		return this.family;
	}

	public getUser( name : string|number ) : WikiUser {
		return new WikiUser( name, this );
	}

	public getUsers( names : (string|number)[] ) : WikiUserSet {
		return new WikiUserSet( names.map( e => this.getUser( e ) ) );
	}
};

Wiki.registerLoader( {
	components: [ 'articlepath', 'generator', 'interwikimap', 'lang', 'name', 'server', 'scriptpath', 'statistics', 'url' ],
	async load( set : Wiki|UncompleteModelSet<Wiki>, components : string[] ) {
		const models : Wiki[] = set instanceof Wiki ? [ set ] : set.models;

		const load : ApiQuerySiteinfoProp[] = [ 'general' ];
		if ( components.includes( 'interwikimap' ) ) {
			load.push( 'interwikimap' );
		}
		if ( components.includes( 'statistics' ) ) {
			load.push( 'statistics' );
		}

		return Promise.all( models.map( model =>
			model.getSiteinfo( load )
				.then( si => {
					if ( components.includes( 'interwikimap' ) ) {
						model.interwikimap = si.query.interwikimap;
					}
					if ( components.includes( 'statistics' ) ) {
						model.statistics = si.query.statistics;
					}

					model.articlepath = si.query.general.articlepath;
					model.generator = si.query.general.generator;
					model.lang = si.query.general.lang;
					model.name = si.query.general.sitename;
					model.server = si.query.general.server;
					model.scriptpath = si.query.general.scriptpath;
					model.url = Wiki.normalizeURL( model.server + model.scriptpath );
				} )
		) );
	}
} );
