import { Fandom } from './Fandom';
import { FetchManager, FetchManagerOptions } from '../../util/util';
import { MercuryWikiVariables, MercuryWikiVariablesResult, NirvanaResult } from '../../interfaces/Fandom';
import { Wiki } from '../Wiki';

export class FandomWiki extends Wiki {
	public network : Fandom;

	constructor( network : Fandom, entrypoint : string, fetchManager : FetchManager|FetchManagerOptions ) {
		super( entrypoint, fetchManager );
		this.network = network;
	}

	public async callNirvana<T extends NirvanaResult = NirvanaResult>( params : Record<string, string> & { controller : string, method? : string } ) : Promise<T> {
		params.format = 'json';
		return await ( await this.fetchManager.queue( this.entrypoint.substring( 0, this.entrypoint.length - 'api.php'.length ) + 'wikia.php?' + ( new URLSearchParams( params ) ).toString() ) ).json();
	}

	public async getMercuryWikiVariables() : Promise<MercuryWikiVariables> {
		return ( await this.callNirvana<MercuryWikiVariablesResult>( {
			controller: 'MercuryApiController',
			method: 'getWikiVariables'
		} ) ).data;
	}
};
