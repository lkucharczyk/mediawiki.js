import { Constructor } from '../../types/util';
import { Loaded, UncompleteModel } from '../models/UncompleteModel';

export type GetSubmodel<
	S extends UncompleteModel & { id?: number },
	C extends { id?: number },// extends Partial<S>,
	K extends keyof S & keyof C & string
> = <T extends number|string|Readonly<( Omit<C, 'id'> & { id: number } )>>( id: T ) =>
	Loaded<S, ( T extends number ? 'id' : T extends string ? K : ( keyof T & keyof S ) )>;

export type FetchSubmodels<
	F extends ( model: any, criteria?: object ) => Promise<UncompleteModel[]>
> = F extends ( model: any, criteria?: infer C, ...args: infer A ) => Promise<( infer R )[]> ? ( criteria?: Exclude<C, undefined>, ...args: A ) => Promise<R[]> : never;

interface SubmodelStatic<M, S extends UncompleteModel> {
	new( model: M, id: number|string ): S,
	fetch?: ( model: M, criteria: object, ...args: any[] ) => Promise<S[]>
}

export function submodel<
	T extends Constructor,
	S extends UncompleteModel,
	C extends Partial<S>
>( subconstructor: SubmodelStatic<InstanceType<T>, S>, name: string ) {
	return function ( constructor: T ) {
		const modelName = name[0].toUpperCase() + name.substring( 1 );

		constructor.prototype['get' + modelName] = function ( id: number|string|( C & ( { id: number } ) ) ) {
			if ( typeof id === 'number' || typeof id === 'string' ) {
				return new subconstructor( this, id );
			}

			return new subconstructor( this, id.id ).fromJSON( id );
		};

		if ( subconstructor.fetch ) {
			constructor.prototype[`fetch${ modelName }s`] = async function ( criteria: object, ...args: unknown[] ) {
				return await subconstructor.fetch!( this, criteria, ...args );
			};
		}

		return constructor;
	};
}
