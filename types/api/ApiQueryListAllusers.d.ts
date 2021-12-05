import { ApiQueryResponse } from './ApiResponse';
import { ApiQueryUser } from './ApiQueryListUsers';
import { ApiQueryRequest } from './ApiRequest';
import { PrefixKeys } from '../util';

// Not every list=users prop is supported by list=allusers
export type ApiQueryListAllusersProps = 'editcount'|'groups'|'implicitgroups'|'registration'|'rights';

export interface ApiQueryListAllusersCriteria {
	activeusers? : 'true';
	excludegroup? : string|readonly string[];
	from? : string;
	group? : string|readonly string[];
	limit? : number|'max';
	prefix? : string;
	rights? : string|readonly string[];
	to? : string;
	witheditsonly? : 'true';
}

export interface ApiQueryListAllusersRequest extends ApiQueryRequest, PrefixKeys<ApiQueryListAllusersCriteria, 'au'> {
	list : 'allusers';
	audir? : 'ascending'|'descending';
	auprop? : ApiQueryListAllusersProps|readonly ApiQueryListAllusersProps[];
}

export interface ApiQueryListAllusersResponse<P extends ApiQueryListAllusersProps = never> extends ApiQueryResponse {
	query : {
		allusers : ApiQueryUser<P>[];
	};
	continue? : {
		aufrom? : string;
	}
}

export type ApiQueryListAllusersRequestResponse<T extends ApiQueryListAllusersRequest> =
	T['auprop'] extends ApiQueryListAllusersProps ? ApiQueryListAllusersResponse<T['auprop']> :
	T['auprop'] extends readonly ApiQueryListAllusersProps[] ? ApiQueryListAllusersResponse<T['auprop'][number]>
		: ApiQueryListAllusersResponse;
