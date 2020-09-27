import { UncompleteModelSet } from './UncompleteModelSet';

export interface UncompleteModelLoader<T extends UncompleteModel = UncompleteModel> {
	components : string[];
	dependencies? : string[];
	load : ( ( model : T ) => Promise<void> ) | ( ( model : T|UncompleteModelSet<T> ) => Promise<void> );
};

export abstract class UncompleteModel {
	public static COMPONENTS : string[] = [];
	public static LOADERS : UncompleteModelLoader[] = [];

	#loading : { [component : string] : Promise<void> } = {};
	#loaded : string[] = [];

	public async load( ...components : string[] ) : Promise<this> {
		const constructor = this.constructor as typeof UncompleteModel;
		const promises = [];
		const toload : string[] = [];

		if ( !components.length ) {
			components = constructor.COMPONENTS;
		}

		for ( const component of components ) {
			if ( component in this.#loading ) {
				promises.push( this.#loading[component] );
				continue;
			} else if ( this.#loaded.includes( component ) ) {
				continue;
			} else if ( constructor.COMPONENTS.includes( component ) ) {
				toload.push( component );
			} else {
				throw new Error( `"${component}" isn't a loadable component in ${constructor.name}.` );
			}
		}

		if ( toload.length ) {
			for ( const loader of constructor.LOADERS ) {
				if ( components.find( e => loader.components.includes( e ) ) ) {
					let promise : Promise<any>;
					if ( loader.dependencies ) {
						promise = this.load( ...loader.dependencies ).then( () => loader.load( this ) );
					} else {
						promise = loader.load( this );
					}

					promises.push( promise );
					this.addLoading( components, promise );
					components = components.filter( e => !loader.components.includes( e ) );
				}
			}
		}

		await Promise.all( promises );

		return this;
	}

	public addLoading( components : string|string[], promise : Promise<void> ) : void {
		const constructor = this.constructor as typeof UncompleteModel;

		if ( !Array.isArray( components ) ) {
			components = [ components ];
		}

		promise.then( () => this.setLoaded( components ) );

		for ( const component of components ) {
			if ( constructor.COMPONENTS.includes( component ) ) {
				this.#loading[component] = promise;
			} else {
				throw new Error( `"${component}" isn't a loadable component in ${constructor.name}.` );
			}
		}
	}

	public isLoading( components : string|string[] ) : { [ component : string ] : boolean|Promise<void> } {
		const out : { [ component : string ] : boolean|Promise<any> } = {};

		if ( !Array.isArray( components ) ) {
			components = [ components ];
		}

		for ( const component of components ) {
			if ( this.isLoaded( components ) ) {
				out[component] = true;
			} else if ( component in this.#loading ) {
				out[component] = this.#loading[component]
			} else {
				out[component] = false;
			}
		}

		return out;
	}

	public isLoaded( components : string|string[] ) : boolean {
		if ( !Array.isArray( components ) ) {
			components = [ components ];
		}

		return !components.find( e => !this.#loaded.includes( e ) );
	}

	public setLoaded( components : string|string[] ) : void {
		const constructor = this.constructor as typeof UncompleteModel;

		if ( !Array.isArray( components ) ) {
			components = [ components ];
		}

		for ( const component of components ) {
			if ( constructor.COMPONENTS.includes( component ) ) {
				this.#loaded.push( component );
			} else {
				throw new Error( `"${component}" isn't a loadable component in ${constructor.name}.` );
			}
		}
	}

	public static registerLoader<T extends UncompleteModel>( ...loaders : UncompleteModelLoader<T>[] ) : void {
		if ( !this.hasOwnProperty( 'COMPONENTS' ) ) {
			this.COMPONENTS = [];
		}

		if ( !this.hasOwnProperty( 'LOADERS' ) ) {
			this.LOADERS = [];
		}

		this.LOADERS.push( ...loaders as any );
		this.COMPONENTS = Array.from( new Set( [ this.COMPONENTS, ...loaders.map( e => e.components ) ].flat() ) );
	}

	public clear() : void {
		this.#loaded = [];
	}
};
