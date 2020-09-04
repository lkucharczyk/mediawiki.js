import { FetchManager, FetchManagerOptions } from '../util/FetchManager';
import { RequestInit } from 'node-fetch';
import { Wiki } from './Wiki';

export abstract class WikiNetwork {
	public readonly name : string;
	protected readonly fetchManager : FetchManager;
	public requestOptions : RequestInit;

	public constructor( name : string, fetchManager? : FetchManager|FetchManagerOptions, requestOptions? : RequestInit ) {
		this.name = name;
		this.fetchManager = fetchManager instanceof FetchManager
			? fetchManager
			: new FetchManager( Object.assign( { name: name }, fetchManager ) );
		this.requestOptions = requestOptions ?? {};
	}

	public abstract getWiki( wiki : string ) : Wiki;
};
