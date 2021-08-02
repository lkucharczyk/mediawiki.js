import { NirvanaErrorResponse } from '../../../types/types';

export class NirvanaError extends Error {
	readonly code : string;

	constructor( public readonly response : NirvanaErrorResponse ) {
		super( response.details );

		this.code = response.error;
	}
};
