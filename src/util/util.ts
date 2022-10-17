import { PrefixKeys } from '../../types/util.js';

export * from './FetchManager';

export function chunkArray<T>( array : T[], chunk : number ) : T[][] {
	const out : T[][] = [];

	for ( let i = 0; i < array.length; i += chunk ) {
		out.push( array.slice( i, i + chunk ) );
	}

	return out;
}

export function uniqueArray<T>( ...arrays : T[][] ) : T[] {
	return Array.from( new Set( arrays.flat() ) );
};

export class MappedArrays<T> {
	#object : { [ key : string ] : T[] } = {};

	raw() {
		return this.#object;
	}

	keys() {
		return Object.keys( this.#object );
	}

	has( key : string ) : boolean {
		return key in this.#object;
	}

	get( key : string ) : T[] {
		return this.#object[key] ?? [];
	}

	push( key : string, item : T ) : number {
		if ( !( key in this.#object ) ) {
			this.#object[key] = [];
		}

		return this.#object[key].includes( item ) ? -1 : this.#object[key].push( item );
	}

	length( key : string ) : number {
		return this.get( key ).length;
	}
};

export function isIterable( obj: { [Symbol.iterator]?: unknown } ): obj is Iterable<unknown> {
	return typeof obj[Symbol.iterator] === 'function';
};

export function prefixKeys<T, P extends string>( obj : T, prefix : P ) : PrefixKeys<T, P> {
	const out : Record<string, unknown> = {};

	for ( const key in obj ) {
		out[prefix + key] = obj[key];
	}

	return out as PrefixKeys<T, P>;
}
