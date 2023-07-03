export type AnyPick<T, K> = Pick<T, Extract<K, keyof T>>;

export type Constructor = new( ...args: any[] ) => any;

export type OnlyOneOf<T extends Record<string, any>> = {
	[ mainkey in keyof T ] : {
		[ key in keyof T ]? : key extends mainkey ? T[mainkey] : never;
	} & Pick<T, mainkey>
}[keyof T];

type SubkeyOf<T extends Record<string, any>> = {
	[ mainkey in keyof T ]: keyof T[mainkey]
}[keyof T];

export type OnlyOneGroup<T extends Record<string, Record<string, any>>> = {
	[ mainkey in keyof T ]: {
		[ key in SubkeyOf<T> ]?: key extends keyof T[mainkey] ? T[mainkey][key] : never;
	}
}[keyof T];

export type PrefixKeys<O, P extends string> = { [ K in keyof O as K extends string ? `${ P }${ K }` : K ] : O[K] };
export type UnprefixKeys<O, P extends string> = { [ K in keyof O as K extends `${ P }${ infer R }` ? R : K ] : O[K] };

export type UnionToIntersection<U> = ( U extends any ? ( k: U ) => void : never ) extends ( ( k: infer I ) => void ) ? I : never;

export type ExtractVal<T extends string, V> = V extends T ? V : V extends T[] ? V[number] : never;
