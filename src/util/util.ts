export * from './FetchManager';

export function uniqueArray<T>( ...arrays : T[][] ) : T[] {
	return Array.from( new Set( arrays.flat() ) );
};
