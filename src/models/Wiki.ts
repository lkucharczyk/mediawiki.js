import { ApiResult } from '../interfaces/Api';
import { FetchManager, FetchManagerOptions } from '../util/FetchManager';

export class Wiki {
	public readonly entrypoint : string;

	#fetchManager : FetchManager;

	/** @param entrypoint api.php entry point */
	public constructor( entrypoint : string, fetchManagerOptions? : FetchManagerOptions ) {
		this.entrypoint = entrypoint;
		this.#fetchManager = new FetchManager( Object.assign( { name: entrypoint }, fetchManagerOptions ) );
	}

	public async callApi( params : Record<string, string> ) : Promise<ApiResult> {
		params.format = 'json';
		return await ( await this.#fetchManager.queue( this.entrypoint + '?' + ( new URLSearchParams( params ) ).toString() ) ).json();
	}
};
