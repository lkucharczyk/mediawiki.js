import { ApiQueryResponse } from './ApiResponse';
import { ApiQueryRequest } from './ApiRequest';

export type ApiQueryMetaTokensType = 'createaccount'|'csrf'|'login'|'patrol'|'rollback'|'userrights'|'watch';

export interface ApiQueryMetaTokensRequest extends ApiQueryRequest {
	meta : 'tokens';
	type? : ApiQueryMetaTokensType|readonly ApiQueryMetaTokensType[];
}

export interface ApiQueryMetaTokensResponse<P extends ApiQueryMetaTokensType = 'csrf'> extends ApiQueryResponse {
	query : {
		tokens : Pick<{
			createaccounttoken : string;
			csrftoken: string;
			logintoken : string;
			patroltoken : string;
			rollbacktoken : string;
			userrightstoken : string;
			watchtoken : string;
		}, `${ P }token`>;
	};
}

export type ApiQueryMetaTokensRequestResponse<T extends ApiQueryMetaTokensRequest> =
	T['type'] extends ApiQueryMetaTokensType ? ApiQueryMetaTokensResponse<T['type']> :
	T['type'] extends readonly ApiQueryMetaTokensType[] ? ApiQueryMetaTokensResponse<T['type'][number]>
		: ApiQueryMetaTokensResponse;
