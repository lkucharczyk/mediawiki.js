import { ApiQueryResponse } from './ApiResponse';
import { ApiQueryUser } from './ApiQueryListUsers';
import { ApiQueryRequest } from './ApiRequest';

// Not every list=users prop is supported by list=allusers
export type ApiQueryListAllusersProps = 'editcount'|'groups'|'implicitgroups'|'registration'|'rights';

export interface ApiQueryListAllusersRequest extends ApiQueryRequest {
	list : 'allusers';
	auactiveusers? : 'true';
	audir? : 'ascending'|'descending';
	auexcludegroup? : string|readonly string[];
	aufrom? : string;
	augroup? : string|readonly string[];
	aulimit? : number|'max';
	auprefix? : string;
	auprop? : ApiQueryListAllusersProps|readonly ApiQueryListAllusersProps[];
	aurights? : string|readonly string[];
	auto? : string;
	auwitheditsonly? : 'true';
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
