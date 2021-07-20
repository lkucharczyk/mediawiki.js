import { ApiQueryRequest } from './ApiRequest';
import { ApiQueryResponse } from './ApiResponse';

export type ApiQueryListUsersProps = 'editcount'|'gender'|'groups'|'implicitgroups'|'registration'|'rights';

export type ApiQueryUser<P extends ApiQueryListUsersProps = never> = {
	name : string;
	userid : number;
} & Pick<{
	editcount : number;
	gender : string;
	groups : string[];
	implicitgroups : string[];
	registration : string;
	rights : string[];
}, P>;

interface ApiQueryListUsersRequestBase extends ApiQueryRequest {
	list : 'users';
	usprop : ApiQueryListUsersProps|readonly ApiQueryListUsersProps[];
}

interface ApiQueryListUsersByIds extends ApiQueryListUsersRequestBase {
	ususerids : number|readonly number[];
	ususers? : never;
}

interface ApiQueryListUsersByName extends ApiQueryListUsersRequestBase {
	ususerids? : never;
	ususers : string|readonly string[];
}

export type ApiQueryListUsersRequest = ApiQueryListUsersByIds|ApiQueryListUsersByName;

export interface ApiQueryListUsersResponse<P extends ApiQueryListUsersProps = never> extends ApiQueryResponse {
	query : {
		users : ApiQueryUser<P>[];
	};
}

export type ApiQueryListUsersRequestResponse<T extends ApiQueryListUsersRequest> =
	T['usprop'] extends ApiQueryListUsersProps ? ApiQueryListUsersResponse<T['usprop']> :
	T['usprop'] extends readonly ApiQueryListUsersProps[] ? ApiQueryListUsersResponse<T['usprop'][number]>
		: ApiQueryListUsersResponse;
