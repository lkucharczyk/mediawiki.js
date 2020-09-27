import {
	ApiQueryInterwikiMapResult,
	ApiQuerySiteinfoProp,
	ApiQuerySiteinfoResult,
	ApiQueryStatisticsResult,
	ApiQueryToken,
	ApiResult
} from '../interfaces/Api';
import { FetchManager, FetchManagerOptions } from '../util/FetchManager';
import { RequestInit, Response } from 'node-fetch';
import { UncompleteModel } from './UncompleteModel';
import { UncompleteModelSet } from './UncompleteModelSet';
import { WikiNetwork } from './WikiNetwork';
import { WikiUser, WikiUserSet } from './WikiUser';

export class Wiki extends UncompleteModel {
	public readonly entrypoint : string;
	public network? : WikiNetwork;
	public requestOptions : RequestInit;

	public articlepath? : string;
	public generator? : string;
	public lang? : string;
	public name? : string;
	public server? : string;
	public scriptpath? : string;

	protected readonly fetchManager : FetchManager;

	/** @param entrypoint api.php entry point */
	public constructor( entrypoint : string, fetchManager? : FetchManager|FetchManagerOptions, requestOptions? : RequestInit ) {
		if ( entrypoint.endsWith( '.php' ) || entrypoint.endsWith( '/$1' ) || entrypoint.endsWith( '/' ) ) {
			entrypoint = entrypoint.substring( 0, entrypoint.lastIndexOf( '/' ) );
		}

		if ( entrypoint.endsWith( '/wiki' ) || entrypoint.endsWith( '/w' ) ) {
			entrypoint = entrypoint.substring( 0, entrypoint.lastIndexOf( '/' ) );
		}

		super();
		this.entrypoint = entrypoint;
		this.fetchManager = fetchManager instanceof FetchManager
			? fetchManager
			: new FetchManager( Object.assign( { name: entrypoint }, fetchManager ) );
		this.requestOptions = requestOptions ?? {};
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
			: this.entrypoint;

		return encodeURI( `${ base }/${ path }` ) + ( params ? `?${( new URLSearchParams( params ) ).toString()}` : '' );
	}

	getWikiURL( path = '', params? : any ) : string {
		const base : string = this.articlepath && this.server
			? this.server + this.articlepath
			: `${ this.entrypoint }/$1`;

		return encodeURI( base.replace( '$1', path ) ) + ( params ? `?${( new URLSearchParams( params ) ).toString()}` : '' );
	}

	public getUser( name : string|number ) : WikiUser {
		return new WikiUser( name, this );
	}

	public getUsers( names : (string|number)[] ) : WikiUserSet {
		return new WikiUserSet( names.map( e => this.getUser( e ) ) );
	}
};

Wiki.registerLoader( {
	components: [ 'articlepath', 'generator', 'lang', 'name', 'server', 'scriptpath' ],
	async load( set : Wiki|UncompleteModelSet<Wiki> ) {
		const models : Wiki[] = set instanceof Wiki ? [ set ] : set.models;

		for ( const model of models ) {
			const si = ( await model.getSiteinfo( [ 'general' ] ) ).query.general;

			model.articlepath = si.articlepath;
			model.generator = si.generator;
			model.lang = si.lang;
			model.name = si.sitename;
			model.server = si.server;
			model.scriptpath = si.scriptpath;
		}
	}
} );
