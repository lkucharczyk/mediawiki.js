import { UncompleteModelSet } from './UncompleteModelSet';

export type Loaded<T, U extends keyof T> = T & Required<Pick<T, U>>;

export interface UncompleteModelLoader<T extends UncompleteModel = UncompleteModel> {
	components : string[];
	dependencies? : string[];
	load : ( ( model : T, components : string[] ) => Promise<any> ) | ( ( model : T|UncompleteModelSet<T>, components : string[] ) => Promise<any> );
};

export abstract class UncompleteModel {
	public static COMPONENTS : string[] = [];
	public static LOADERS : UncompleteModelLoader[] = [];

	#loading : { [component : string] : Promise<any> } = {};
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
						promise = this.load( ...loader.dependencies ).then( () => loader.load( this, components ) );
					} else {
						promise = loader.load( this, components );
					}

					promises.push( promise );
					this.addLoading( components, promise );
					components = components.filter( e => !loader.components.includes( e ) );
				}
			}
		}

		return Promise.all( promises ).then( () => this );
	}

	public addLoading( components : string|string[], promise : Promise<any> ) : void {
		const constructor = this.constructor as typeof UncompleteModel;

		if ( !Array.isArray( components ) ) {
			components = [ components ];
		}

		promise.then( () => this.setLoaded( components ) ).catch( e => false );

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

	public fromJSON( data : Partial<this> ) : this {
		for ( const prop in data ) {
			if ( data.hasOwnProperty( prop ) && typeof data[prop] !== 'function' && ( this.constructor as typeof UncompleteModel ).COMPONENTS.includes( prop ) ) {
				this[prop] = data[prop] as any;
				this.setLoaded( prop );
			}
		}

		return this;
	}

	public toJSON() : any {
		const out : any = {};

		for ( const prop in this ) {
			if ( typeof this[prop] !== 'object' && typeof this[prop] !== 'function' ) {
				out[prop] = this[prop];
			}
		}

		return out;
	}
};
