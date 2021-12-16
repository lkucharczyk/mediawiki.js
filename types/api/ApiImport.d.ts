import { OnlyOneGroup, OnlyOneOf } from '../util';
import { ApiRequestBase } from './ApiRequest';
import { ApiResponse } from './ApiResponse';

export type ApiImportRequest = ApiRequestBase & {
	action: 'import';
	assignknownusers?: 'true';
	summary?: string;
	tags?: string|readonly string[];
	token: string;
} & OnlyOneGroup<{
	interwiki: {
		fullhistory?: 'true';
		interwikisource: string;
		interwikipage: string;
		templates?: 'true';
	};
	upload: {
		interwikiprefix: string;
		// xml: ReadableStream via form-data
	};
}> & OnlyOneOf<{
	namespace?: number;
	rootpage?: string;
}>;

export interface ApiImportResponse extends ApiResponse {
	import: (
		{
			title: string;
			invalid: true
		} | {
			title: string;
			invalid?: never;
			ns: number;
			revisions: number;
		}
	)[];
}
