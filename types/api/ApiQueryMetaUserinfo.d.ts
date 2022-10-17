import { ApiQueryResponse } from './ApiResponse';
import { ApiQueryRequest } from './ApiRequest';

export type ApiQueryMetaUserinfoProps = 'rights';

export interface ApiQueryMetaUserinfoRequest extends ApiQueryRequest {
	meta : 'userinfo';
	uiprop? : ApiQueryMetaUserinfoProps|readonly ApiQueryMetaUserinfoProps[];
}

export interface ApiQueryMetaUserinfoResponse<P extends ApiQueryMetaUserinfoProps = never> extends ApiQueryResponse {
	query : {
		userinfo: {
			id : number;
			name : string;
			anon : boolean;
		} & ( Extract<P, 'rights'> extends never ? {} : { rights: string[] } );
	};
}

export type ApiQueryMetaUserinfoRequestResponse<T extends ApiQueryMetaUserinfoRequest> =
	T['uiprop'] extends ApiQueryMetaUserinfoProps ? ApiQueryMetaUserinfoResponse<T['uiprop']> :
	T['uiprop'] extends readonly ApiQueryMetaUserinfoProps[] ? ApiQueryMetaUserinfoResponse<T['uiprop'][number]>
		: ApiQueryMetaUserinfoResponse;
