import fetch, { Response, RequestInit } from 'node-fetch';

export type FetchLike = ( url: string, init?: RequestInit ) => Promise<Response>;

export interface FetchManagerOptions {
	fetch? : FetchLike;
	maxRequests? : number;
	waitTime? : number;
	verbose? : number;
	name? : string;
};

export interface FetchManagerOptionsRequired extends FetchManagerOptions {
	fetch : FetchLike;
	maxRequests : number;
	waitTime : number;
	verbose : number;
};

interface QueuedRequest {
	url : string,
	options? : RequestInit,
	resolve : ( result : Response ) => void
	reject : ( error : Error ) => void
};

export class FetchManager implements FetchManagerOptionsRequired {
	public static readonly VERBOSE_NONE  = 0;
	public static readonly VERBOSE_INFO  = 1;
	public static readonly VERBOSE_DEBUG = 2;

	public static defaults : FetchManagerOptionsRequired = {
		fetch,
		maxRequests: 1,
		waitTime: 0,
		verbose: FetchManager.VERBOSE_NONE
	};

	protected static instances = 0;

	public fetch : FetchLike;
	public maxRequests : number;
	public waitTime : number;
	public verbose : number;
	public name? : string;

	#id : number;
	#active : number = 0;
	#queue : QueuedRequest[] = [];

	public constructor( options: FetchManagerOptions = FetchManager.defaults ) {
		this.#id = FetchManager.instances++;
		this.name = options.name ?? FetchManager.defaults.name;
		this.fetch = options.fetch ?? FetchManager.defaults.fetch;
		this.maxRequests = options.maxRequests ?? FetchManager.defaults.maxRequests;
		this.waitTime = options.waitTime ?? FetchManager.defaults.waitTime;
		this.verbose = options.verbose ?? FetchManager.defaults.verbose;
	}

	public async queue( url: string, options?: RequestInit ): Promise<Response> {
		return new Promise( ( resolve, reject ) => {
			this.#queue.push( {
				url,
				options,
				resolve,
				reject
			} );
			this.log( FetchManager.VERBOSE_INFO, 'Queued', options?.method ?? 'GET', url, options?.method === 'POST' ? JSON.stringify( options.body ) : null );
			this.process();
		} );
	}

	private async process() {
		if ( this.#active >= this.maxRequests ) {
			return;
		}

		this.#active++;
		this.log( FetchManager.VERBOSE_DEBUG, `Starting fetch loop (${ this.#active }/${ this.maxRequests } active)` );

		let request;
		while ( request = this.#queue.pop() ) {
			this.log( FetchManager.VERBOSE_DEBUG, 'Requested', request.url );
			await this.fetch( request.url, request.options ).then( request.resolve, request.reject );
			this.log( FetchManager.VERBOSE_DEBUG, 'Received', request.url );
			await this.wait();
		}

		this.#active--;
		this.log( FetchManager.VERBOSE_DEBUG, `Ending fetch loop (${ this.#active }/${ this.maxRequests } active)` );
	}

	private async wait() : Promise<void> {
		return this.waitTime > 0
			? new Promise( ( resolve ) => { setTimeout( resolve, this.waitTime ); } )
			: Promise.resolve();
	}

	private log( level: number, ...args: unknown[] ) {
		if ( this.verbose >= level ) {
			console.log( `[FetchManager#${ this.#id }${ this.name ? `:${ this.name }` : '' }]`, ...args );
		}
	}
};
