import { Constructor } from '../../types/util';
import { Loaded, UncompleteModel } from '../models/UncompleteModel';

export type GetSubmodel<
	S extends UncompleteModel & { id?: number },
	C extends Partial<S>,
	K extends keyof S & keyof C & string
> = <T extends number|string|( Omit<C, 'id'> & { id: number } )>( id: Readonly<T> ) =>
	Loaded<S, ( T extends number ? 'id' : T extends string ? K : ( keyof T & keyof S ) )>;

export type FetchSubmodels<
	F extends ( model: any, criteria?: object ) => Promise<UncompleteModel[]>
> = F extends ( model: any, criteria?: infer C ) => Promise<( infer R )[]> ? ( criteria?: Exclude<C, undefined> ) => Promise<R[]> : never;

export function submodel<
	T extends Constructor,
	S extends {
		new( model: InstanceType<T>, id: number|string ): UncompleteModel & { id?: number },
		fetch?: ( model: InstanceType<T>, criteria: object ) => Promise<InstanceType<S>[]>
	},
	C extends Partial<InstanceType<S>>
>( subconstructor: S, name: string ) {
	return function( constructor: T ) {
		const modelName = name[0].toUpperCase() + name.substring( 1 );

		constructor.prototype['get' + modelName] = function( id: number|string|( C & ( { id: number } ) ) ) {
			if ( typeof id === 'number' || typeof id === 'string' ) {
				return new subconstructor( this, id );
			}

			return new subconstructor( this, id.id ).fromJSON( id );
		};

		if ( subconstructor.fetch ) {
			constructor.prototype[`fetch${ modelName }s`] = function( criteria: object ) {
				return subconstructor.fetch!( this, criteria );
			};
		}

		return constructor;
	}
}
