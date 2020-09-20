import { UncompleteModel } from './UncompleteModel';

export class UncompleteModelSet<T extends UncompleteModel> {
	public readonly models : T[];

	public constructor( models : T[] ) {
		this.models = models;
	}

	public async load( ...components : string[] ) : Promise<this> {
		components = components.filter( c => this.models.find( m => !m.isLoading( c ) ) );

		await this.__load( components );

		return this;
	}

	protected async __load( components : string[] ) : Promise<any> {
		const promises = [];

		if ( components.length ) {
			for ( const model of this.models ) {
				promises.push( model.load( ...components ) );
			}
		}

		return Promise.all( promises );
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
};
