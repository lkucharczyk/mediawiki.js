export abstract class UncompleteModel {
	public static readonly COMPONENTS : string[] = [];

	#loading : { [component : string] : Promise<void> } = {};
	#loaded : string[] = [];

	protected async abstract __load( components : string[] ) : Promise<void>;

	public async load( ...components : string[] ) : Promise<void> {
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
			const loader = this.__load( toload );
			promises.push( loader );
			for ( const component of toload ) {
				this.#loading[component] = loader;
			}
		}

		await Promise.all( promises );
	}

	public addLoading( components : string|string[], promise : Promise<void> ) : void {
		const constructor = this.constructor as typeof UncompleteModel;

		if ( !Array.isArray( components ) ) {
			components = [ components ];
		}

		for ( const component of components ) {
			if ( constructor.COMPONENTS.includes( component ) ) {
				this.#loading.component = promise;
			} else {
				throw new Error( `"${component}" isn't a loadable component in ${constructor.name}.` );
			}
		}
	}

	public isLoading( components : string|string[] ) : boolean {
		if ( this.isLoaded( components ) ) {
			return true;
		}

		if ( !Array.isArray( components ) ) {
			components = [ components ];
		}

		return !components.find( e => !( e in this.#loaded ) );
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

	public clear() : void {
		this.#loaded = [];
	}
};
