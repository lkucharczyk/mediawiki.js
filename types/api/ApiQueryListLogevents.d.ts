import { AnyPick } from '../util';
import { ApiQueryRequest } from './ApiRequest';
import { ApiQueryResponse } from './ApiResponse';

export type ApiQueryListLogeventsProps = 'comment'|'details'|'ids'|'parsedcomment'|'tags'|'timestamp'|'title'|'type'|'user'|'userid';

export interface ApiQueryListLogeventsRequest extends ApiQueryRequest {
	list: 'logevents';
	leaction?: string|readonly string[];
	lecontinue?: string;
	ledir?: 'newer'|'older';
	leend?: Date|string;
	lelimit?: number|'max';
	lenamespace?: number;
	leprop?: ApiQueryListLogeventsProps|readonly ApiQueryListLogeventsProps[];
	lestart?: Date|string;
	letag?: string;
	letitle?: string;
	letype?: string;
	leuser?: string;
}

export interface KnownLogDetails<A extends string> {
	'rights/autopromote': never;
	'rights/rights': A extends 'rights/autopromote'|'rights/rights' ? {
			newgroups: string[];
			oldgroups: string[];
			newmetadata: {
				group: string;
				expiry: string;
			}[];
			oldmetadata: {
				group: string;
				expiry: string;
			}[];
		} : never;
}

export type LogEvent<P extends ApiQueryListLogeventsProps, A extends string = string> =
	AnyPick<{
		comment: string;
		parsedcomment: string;
		tags: string[];
		timestamp: string;
		user: string;
		userid: number;
	}, P>
	& ( Extract<P, 'details'> extends never ? {} : {
		params: Exclude<KnownLogDetails<A>[keyof KnownLogDetails<A>], never> extends never
			? Partial<Record<string, unknown>>
			: Exclude<KnownLogDetails<A>[keyof KnownLogDetails<A>], never>
				|( Exclude<A, keyof KnownLogDetails<A>> extends never ? never : Partial<Record<string, unknown>> );
	} )
	& ( Extract<P, 'ids'> extends never ? {} : {
		logid: number;
		logpage: number;
		pageid: number;
	} )
	& ( Extract<P, 'title'> extends never ? {} : {
		ns: number;
		title: string;
	} )
	& ( Extract<P, 'type'> extends never ? {} : {
		action: A;
		type: string;
	} )

export interface ApiQueryListLogeventsResponse<A extends string = string, P extends ApiQueryListLogeventsProps = 'comment'|'details'|'timestamp'|'title'|'type'|'user'> extends ApiQueryResponse {
	query : {
		logevents : LogEvent<P, A>[];
	}
}

type ExtractAction<T extends string|undefined|readonly string[]> = Exclude<T, undefined> extends string ? Exclude<T, undefined> : Exclude<T, undefined>[number];

export type ApiQueryListLogeventsRequestResponse<T extends ApiQueryListLogeventsRequest> =
	T['leprop'] extends ApiQueryListLogeventsProps ? ApiQueryListLogeventsResponse<ExtractAction<T['leaction']>, T['leprop']> :
	T['leprop'] extends readonly ApiQueryListLogeventsProps[] ? ApiQueryListLogeventsResponse<ExtractAction<T['leaction']>, T['leprop'][number]>
		: ApiQueryListLogeventsResponse<ExtractAction<T['leaction']>>;
