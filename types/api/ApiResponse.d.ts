export interface ApiErrorResponse {
	error : {
		code : string;
		docref : string;
		info : string;
	}
}

export interface ApiResponse {
	error? : never;
	warnings? : Record<string, { warnings: string }>;
}

export interface ApiQueryResponse extends ApiResponse {
	normalized? : {
		fromencoded : boolean;
		from : string;
		to : string;
	}[];
	query : {};
	continue? : {
		[ k : string ] : number|string|undefined;
	};
	limits?: Partial<Record<string, number>>;
}
