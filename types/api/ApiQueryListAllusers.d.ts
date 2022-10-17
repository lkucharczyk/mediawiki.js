import { ApiQueryResponse } from './ApiResponse';
import { ApiQueryUser } from './ApiQueryListUsers';
import { ApiQueryRequest } from './ApiRequest';
import { PrefixKeys } from '../util';

export namespace ApiQueryListAllusers {
	// Not every list=users prop is supported by list=allusers
	export type Props = 'editcount'|'groups'|'implicitgroups'|'registration'|'rights';

	export interface Criteria {
		activeusers?: 'true',
		excludegroup?: string|readonly string[],
		from?: string,
		group?: string|readonly string[],
		limit?: number|'max',
		prefix?: string,
		rights?: string|readonly string[],
		to?: string,
		witheditsonly?: 'true'
	}

	export interface Request extends ApiQueryRequest, PrefixKeys<Criteria, 'au'> {
		list: 'allusers'
		audir?: 'ascending'|'descending'
		auprop?: Props|readonly Props[]
	}

	export interface Response<P extends Props = never> extends ApiQueryResponse {
		query: {
			allusers: ApiQueryUser<P>[]
		},
		continue?: {
			aufrom?: string
		}
	}

	export type RequestResponse<T extends Request> =
		T['auprop'] extends Props
			? Response<T['auprop']>
			: T['auprop'] extends readonly Props[]
				? Response<T['auprop'][number]>
				: Response;
}
