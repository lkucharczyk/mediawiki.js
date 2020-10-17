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
