import { ApiResult } from '../interfaces/Api';
import { FetchManager, FetchManagerOptions } from '../util/FetchManager';
import { WikiNetwork } from './WikiNetwork';

export class Wiki {
	public readonly entrypoint : string;
	public network? : WikiNetwork;

	protected readonly fetchManager : FetchManager;

	/** @param entrypoint api.php entry point */
	public constructor( entrypoint : string, fetchManager? : FetchManager|FetchManagerOptions ) {
		this.entrypoint = entrypoint;
		this.fetchManager = fetchManager instanceof FetchManager
			? fetchManager
			: new FetchManager( Object.assign( { name: entrypoint }, fetchManager ) );
	}

	public async callApi( params : Record<string, string> ) : Promise<ApiResult> {
		params.format = 'json';
		return await ( await this.fetchManager.queue( this.entrypoint + '?' + ( new URLSearchParams( params ) ).toString() ) ).json();
	}
};
