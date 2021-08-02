export type OnlyOneOf<T extends Record<string, any>> = {
	[ mainkey in keyof T ] : {
		[ key in keyof T ]? : key extends mainkey ? T[mainkey] : never;
	} & Pick<T, mainkey>
}[keyof T];

export type UnionToIntersection<U> = ( U extends any ? ( k : U ) => void : never ) extends ( ( k : infer I ) => void ) ? I : never;
