import { UncompleteModel, UncompleteModelLoader } from './UncompleteModel';

export interface UncompleteModelSetLoader<T extends UncompleteModel = UncompleteModel> extends UncompleteModelLoader<T> {
	components : string[];
	dependencies? : string[];
	load( set : T|UncompleteModelSet<T> ) : Promise<void>;
};

interface UncompleteModelSet<T extends UncompleteModel> {
	map<U>( callbackfn: ( value: T, index: number, array: T[] ) => U, thisArg?: any ) : U[];
};

class UncompleteModelSet<T extends UncompleteModel> {
	public static LOADERS : UncompleteModelSetLoader[] = [];

	public readonly models : T[];

	public constructor( models : T[] ) {
		this.models = models;
		this.map = this.models.map.bind( this.models );
	}

	public async load( ...components : string[] ) : Promise<this> {
		const constructor = this.constructor as typeof UncompleteModelSet;

		const loading = this.models.map( e => e.isLoading( components ) );
		components = components.filter( c => !loading.every( m => m[c] === true || m[c] instanceof Promise ) );

		const promises = loading.flatMap( e => Object.values( e ).filter( e => e instanceof Promise ) ) as Promise<any>[];

		if ( components.length ) {
			for ( const loader of constructor.LOADERS ) {
				if ( components.find( e => loader.components.includes( e ) ) ) {
					const loaded = [ ...loader.components, ...( loader.dependencies ?? [] ) ];

					let promise : Promise<any>;
					if ( loader.dependencies ) {
						promise = this.load( ...loader.dependencies ).then( () => loader.load( this ) );
					} else {
						promise = loader.load( this );
					}

					promises.push( promise );
					for ( const model of this.models ) {
						model.addLoading( loaded, promise );
					}
					components = components.filter( e => !loaded.includes( e ) );
				}
			}

			if ( components.length ) {
				for ( const model of this.models ) {
					promises.push( model.load( ...components ) );
				}
			}
		}



		await Promise.all( promises );

		return this;
	}

	protected setLoaded( components : string|string[] ) : void {
		for ( const model of this.models ) {
			model.setLoaded( components );
		}
	}

	public clear() {
		for ( const model of this.models ) {
			model.clear();
		}
	}


	public static registerLoader<T extends UncompleteModel = UncompleteModel>( ...loaders : UncompleteModelSetLoader<T>[] ) : void {
		if ( !this.hasOwnProperty( 'LOADERS' ) ) {
			this.LOADERS = [];
		}

		this.LOADERS.push( ...loaders );
	}
};

export { UncompleteModelSet };
