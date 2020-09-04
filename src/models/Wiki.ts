import { ApiResult } from '../interfaces/Api';
import { FetchManager, FetchManagerOptions } from '../util/FetchManager';
import { Response, RequestInit } from 'node-fetch';
import { WikiNetwork } from './WikiNetwork';

export class Wiki {
	public readonly entrypoint : string;
	public network? : WikiNetwork;
	public requestOptions : RequestInit;

	protected readonly fetchManager : FetchManager;

	/** @param entrypoint api.php entry point */
	public constructor( entrypoint : string, fetchManager? : FetchManager|FetchManagerOptions, requestOptions? : RequestInit ) {
		if ( entrypoint.endsWith( '.php' ) || entrypoint.endsWith( '/' ) ) {
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

		return this.fetchManager.queue( url, Object.assign( {}, this.requestOptions, options ) );
	}

	public async callApi( params : Record<string, string>, options? : RequestInit ) : Promise<ApiResult> {
		params.format = 'json';
		return ( await this.call( 'api.php', params, options ) ).json();
	}

	public async callIndex( params : Record<string, string>, options? : RequestInit ) : Promise<Response> {
		return this.call( 'index.php', params, options );
	}
};
