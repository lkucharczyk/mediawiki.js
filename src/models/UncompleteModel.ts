import { UncompleteModelSet } from './UncompleteModelSet';

export type Loaded<T, U extends keyof T> = T & Required<Pick<T, U>>;

export interface UncompleteModelLoader<T extends UncompleteModel = UncompleteModel> {
	components: string[];
	dependencies?: string[];
	load: ( ( model: T, components: string[] ) => Promise<string[]|void> )
		| ( ( model: T|UncompleteModelSet<T>, components: string[] ) => Promise<string[]|void> );
};

export interface UncompleteModelLoaderT<
	T extends UncompleteModel = UncompleteModel,
	C extends Extract<keyof T, string> = Extract<keyof T, string>,
	D extends Extract<keyof T, string>|never = Extract<keyof T, string>|never
> {
	components: C[];
	dependencies?: D[];
	load: ( ( model: Loaded<T, D>, components: Extract<keyof T, string>[] ) => Promise<Extract<keyof T, string>[]|void> )
		| ( ( model: Loaded<T, D>|UncompleteModelSet<T>, components: Extract<keyof T, string>[] ) => Promise<Extract<keyof T, string>[]|void> );
};

export abstract class UncompleteModel {
	public static COMPONENTS : string[] = [];
	public static LOADERS : UncompleteModelLoader[] = [];

	#loading : Record<string, Promise<string[]|void>> = {};
	#loaded : string[] = [];

	public async load( ...components: [ UncompleteModelLoaderT<this> ]|string[] ): Promise<this> {
		const constructor = this.constructor as typeof UncompleteModel;
		const promises = [];
		const toload: string[] = [];

		if ( ( ( c ): c is [ UncompleteModelLoaderT<this> ] => ( c.length === 1 && typeof c[0] === 'object' ) )( components ) ) {
			const loader = components[0];
			const toload2 = loader.components.filter( c => !this.#loaded.includes( c ) );

			if ( toload2.length === 0 ) {
				return this;
			}

			const promise = loader.dependencies
				? this.load( ...loader.dependencies ).then( async m => loader.load( m as any, toload2 ) )
				: loader.load( this as any, toload2 );

			this.addLoading( toload2, promise );
			return promise.then( () => this );
		}

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
				throw new Error( `"${ component }" isn't a loadable component in ${ constructor.name }.` );
			}
		}

		if ( toload.length ) {
			for ( const loader of constructor.LOADERS ) {
				const match: string[] = components.filter( e => loader.components.includes( e ) );
				if ( match.length > 0 ) {
					let promise: Promise<string[]|void>;
					if ( loader.dependencies ) {
						promise = this.load( ...loader.dependencies ).then( async () => loader.load( this, match ) );
					} else {
						promise = loader.load( this, match );
					}

					promises.push( promise );
					this.addLoading( match, promise );
					components = components.filter( e => !match.includes( e ) );
				}
			}
		}

		return Promise.all( promises ).then( () => this );
	}

	public addLoading( components : string|string[], promise : Promise<string[]|void> ) : void {
		const constructor = this.constructor as typeof UncompleteModel;

		if ( !Array.isArray( components ) ) {
			components = [ components ];
		}

		promise.then( ( c ) => this.setLoaded( c ? c : components ) ).catch( () => false );

		for ( const component of components ) {
			if ( constructor.COMPONENTS.includes( component ) ) {
				this.#loading[component] = promise;
			} else {
				throw new Error( `"${ component }" isn't a loadable component in ${ constructor.name }.` );
			}
		}
	}

	public isLoading<T extends string>( components : T|T[] ) : Record<T, boolean|Promise<string[]|void>> {
		if ( !Array.isArray( components ) ) {
			components = [ components ];
		}

		const out = {} as Record<T, boolean|Promise<string[]|void>>;

		for ( const component of components ) {
			if ( this.isLoaded( components ) ) {
				out[component] = true;
			} else if ( component in this.#loading ) {
				out[component] = this.#loading[component] as Promise<string[]|void>;
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
				throw new Error( `"${ component }" isn't a loadable component in ${ constructor.name }.` );
			}
		}
	}

	public static registerLoader<T extends UncompleteModel>( ...loaders: ( UncompleteModelLoader<T>|UncompleteModelLoaderT<T> )[] ) : void {
		if ( !this.hasOwnProperty( 'COMPONENTS' ) ) {
			this.COMPONENTS = [];
		}

		if ( !this.hasOwnProperty( 'LOADERS' ) ) {
			this.LOADERS = [];
		}

		this.LOADERS.push( ...loaders as any );
		this.COMPONENTS = Array.from( new Set( [ this.COMPONENTS, ...loaders.map( e => e.components ) ].flat() ) );
	}

	public clear() {
		this.#loaded = [];
	}

	public fromJSON( data: Partial<this> ): this {
		for ( const prop in data ) {
			if (
				data.hasOwnProperty( prop )
				&& data[prop as keyof typeof data] !== undefined
				&& typeof data[prop as keyof typeof data] !== 'function'
				&& ( this.constructor as typeof UncompleteModel ).COMPONENTS.includes( prop )
			) {
				this[prop as keyof this] = data[prop as keyof typeof data] as unknown as this[keyof this];
				this.setLoaded( prop );
			}
		}

		return this;// as Loaded<this, Extract<keyof C, keyof this>>;
	}

	public toJSON(): Record<string, any> {
		const out: Record<string, any> = {};

		for ( const prop in this ) {
			if (
				( this.constructor as typeof UncompleteModel ).COMPONENTS.includes( prop )
				&& typeof this[prop] !== 'function'
			) {
				out[prop] = this[prop];
			}
		}

		return out;
	}
};
