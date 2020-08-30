import { Fandom } from './Fandom';
import { FetchManager, FetchManagerOptions } from '../../util/util';
import { Wiki } from '../Wiki';

export class FandomWiki extends Wiki {
	public network : Fandom;

	constructor( network : Fandom, entrypoint : string, fetchManager : FetchManager|FetchManagerOptions ) {
		super( entrypoint, fetchManager );
		this.network = network;
	}
};
