import {
	ApiQueryInterwikiMapResult,
	ApiQuerySiteinfoProp,
	ApiQuerySiteinfoResult,
	ApiResult,
	ApiQueryStatisticsResult,
	ApiQueryToken
} from '../interfaces/Api';
import { FetchManager, FetchManagerOptions } from '../util/FetchManager';
import { RequestInit, Response } from 'node-fetch';
import { WikiNetwork } from './WikiNetwork';

export class Wiki {
	public readonly entrypoint : string;
	public network? : WikiNetwork;
	public requestOptions : RequestInit;

	protected readonly fetchManager : FetchManager;

	/** @param entrypoint api.php entry point */
	public constructor( entrypoint : string, fetchManager? : FetchManager|FetchManagerOptions, requestOptions? : RequestInit ) {
		if ( entrypoint.endsWith( '.php' ) || entrypoint.endsWith( '/$1' ) || entrypoint.endsWith( '/' ) ) {
			entrypoint = entrypoint.substring( 0, entrypoint.lastIndexOf( '/' ) );
		}

		if ( entrypoint.endsWith( '/wiki' ) || entrypoint.endsWith( '/w' ) ) {
			entrypoint = entrypoint.substring( 0, entrypoint.lastIndexOf( '/' ) );
		}

		this.entrypoint = entrypoint;
		this.fetchManager = fetchManager instanceof FetchManager
			? fetchManager
			: new FetchManager( Object.assign( { name: entrypoint }, fetchManager ) );
		this.requestOptions = requestOptions ?? {};
	}

	public async call( path? : string, params? : Record<string, string>, options? : RequestInit ) : Promise<Response> {
		let url = this.entrypoint;

		if ( path ) {
			url += `/${path}`;
		}

		if ( params ) {
			url += `?${( new URLSearchParams( params ) ).toString()}`;
		}

		const requestOptions = Object.assign( {}, this.requestOptions, options );
		if ( typeof this.requestOptions?.headers === 'object' && typeof options?.headers === 'object' ) {
			requestOptions.headers = Object.assign( {}, this.requestOptions.headers, options.headers );
		}

		return this.fetchManager.queue( url, requestOptions );
	}

	public async callApi<T extends ApiResult = ApiResult>( params : Record<string, string>, options? : RequestInit ) : Promise<T> {
		params.format = 'json';

		if ( options?.method === 'POST' && options?.body === undefined ) {
			options = options ?? {};
			options.headers = options.headers ?? {};

			options.body = JSON.stringify( params );
			params = {};
			Object.assign( options.headers, { 'Content-Type': 'application/json' } );
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
};
