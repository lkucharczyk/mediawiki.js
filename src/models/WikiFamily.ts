import { ApiQueryInterwikiMapResult, ApiQuerySiteinfoResult } from '../interfaces/Api';
import { MappedArrays } from '../util/util';
import { Loaded } from './UncompleteModel';
import { Wiki } from './Wiki';

export enum FamilyInvalidConnectionReason {
	CONFLICT,
	DOESNT_EXIST,
	LANG_MISMATCH,
	SAME_LANG
};

export interface FamilyInvalidConnection {
	reason : FamilyInvalidConnectionReason;
	source : Wiki;
	lang : string;
	target : Wiki;
};

export class WikiFamily {
	public readonly base : Wiki;
	public readonly strict : boolean;
	public readonly wikis : { [ lang : string ] : Wiki } = {};

	#loader? : Promise<this>;
	#conflicts : MappedArrays<string> = new MappedArrays();
	#invalid : FamilyInvalidConnection[] = [];
	#missingLinks : MappedArrays<Wiki> = new MappedArrays();
	#linkedBy : MappedArrays<Wiki> = new MappedArrays();

	public constructor( base : Wiki, strict : boolean = true ) {
		this.base = base;
		this.strict = strict;
	}

	public async load() : Promise<this> {
		if ( !this.#loader ) {
			this.#loader = this.__load();
		}

		return this.#loader;
	}

	protected async __load() : Promise<this> {
		const cache : { [ url : string ] : Wiki } = {
			[this.base.url]: this.base
		};

		function getWiki( url : string ) : Wiki {
			if ( !( url in cache ) ) {
				cache[url] = new Wiki( url );
			}

			return cache[url];
		}

		const queue = [ this.base ];

		while ( queue.length ) {
			let source = queue.shift() as Loaded<Wiki, 'interwikimap'|'lang'>;

			await source.load( 'interwikimap', 'lang' ).catch( () => { throw new Error( `Family base wiki ${ source.entrypoint } doesn't exist.` ) } );
			this.wikis[source.lang] = source;

			for ( const interwiki of source.interwikimap ) {
				if ( !interwiki.language ) {
					continue;
				}

				const target = getWiki( interwiki.api ?? interwiki.url ) as Loaded<Wiki, 'interwikimap'|'lang'>;
				target.family = this;

				if ( interwiki.prefix === source.lang ) {
					this.#invalid.push( {
						source: source,
						target: target,
						lang: interwiki.prefix,
						reason: FamilyInvalidConnectionReason.SAME_LANG
					} );
					continue;
				}

				if ( this.strict ) {
					if ( ( await target.load( 'interwikimap', 'lang' ).catch( () => null ) ) === null ) {
						this.#linkedBy.push( target.url, source );
						this.#invalid.push( {
							source: source,
							target: target,
							lang: interwiki.prefix,
							reason: FamilyInvalidConnectionReason.DOESNT_EXIST
						} );
						continue;
					}

					this.#linkedBy.push( target.url, source );

					if ( target.lang !== interwiki.prefix ) {
						this.#invalid.push( {
							source: source,
							target: target,
							lang: interwiki.prefix,
							reason: FamilyInvalidConnectionReason.LANG_MISMATCH
						} );
					} else {
						if ( interwiki.prefix in this.wikis ) {
							if ( this.#conflicts.has( interwiki.prefix ) ) {
								if ( this.#conflicts.push( interwiki.prefix, target.url ) > -1 ) {
									queue.push( target );
								}
							} else if ( this.wikis[interwiki.prefix].url.replace( /^https?:\/\//, '//' ) !== target.url.replace( /^https?:\/\//, '//' ) ) {
								this.#conflicts.push( interwiki.prefix, this.wikis[interwiki.prefix].url );
								this.#conflicts.push( interwiki.prefix, target.url );
								queue.push( target );
							}
						} else {
							this.wikis[interwiki.prefix] = target;
							queue.push( target );
						}
					}
				} else {
					this.#linkedBy.push( target.url, source );
					this.wikis[interwiki.prefix] = target;
				}
			}
		}

		if ( this.strict ) {
			for ( const lang of this.#conflicts.keys() ) {
				delete this.wikis[lang];
			}

			const wikis = Object.values( this.wikis );
			for ( const wiki of wikis ) {
				const linked = this.#linkedBy.get( wiki.url );
				for ( const ml of wikis.filter( e => e !== wiki && !linked.includes( e ) ) ) {
					this.#missingLinks.push( ml.url, wiki );
				}
			}
		}

		return this;
	}

	get langs() : string[] {
		return Object.keys( this.wikis ).sort();
	}

	get valid() : boolean {
		return this.#invalid.length === 0;
	}

	get conflicts() {
		return this.#conflicts;
	}

	get invalid() {
		return this.#invalid;
	}

	get linkedBy() {
		return this.#linkedBy;
	}

	get missingLinks() {
		return this.#missingLinks;
	}
};
