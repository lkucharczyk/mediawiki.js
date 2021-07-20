import { ApiErrorResponse } from '../../types/types';

export class WikiApiError extends Error {
	readonly code : string;

	constructor( public readonly response : ApiErrorResponse ) {
		super( response.error.info );

		this.code = response.error.code;
	}
};
