import { FetchManager, FetchManagerOptions } from '../util/FetchManager';
import { Wiki } from './Wiki';

export abstract class WikiNetwork {
	public readonly name : string;
	protected readonly fetchManager : FetchManager;

	public constructor( name : string, fetchManager? : FetchManager|FetchManagerOptions ) {
		this.name = name;
		this.fetchManager = fetchManager instanceof FetchManager
			? fetchManager
			: new FetchManager( Object.assign( { name: name }, fetchManager ) );
	}

	public abstract getWiki( wiki : string ) : Wiki;
};
