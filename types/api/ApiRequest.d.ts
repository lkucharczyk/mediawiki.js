import { ApiQueryResponse, ApiResponse } from './ApiResponse';
import { ApiQueryMetaSiteinfoRequest, ApiQueryMetaSiteinfoRequestResponse } from './ApiQueryMetaSiteinfo';
import { ApiQueryMetaTokensRequest, ApiQueryMetaTokensRequestResponse } from './ApiQueryMetaTokens';
import { ApiQueryMetaUserinfoRequest, ApiQueryMetaUserinfoRequestResponse } from './ApiQueryMetaUserinfo';
import { ApiParseRequest, ApiParseRequestResponse } from './ApiParse';
import { ApiQueryListUsersRequest, ApiQueryListUsersRequestResponse } from './ApiQueryListUsers';
import { ApiQueryPageRequest, ApiQueryPageRequestResponse } from './ApiQueryPage';
import { ApiQueryListAllusersRequest, ApiQueryListAllusersRequestResponse } from './ApiQueryListAllusers';
import { ApiQueryListRecentChangesRequest, ApiQueryListRecentChangesRequestResponse } from './ApiQueryListRecentchanges';
import { ApiQueryListLogeventsRequest, ApiQueryListLogeventsRequestResponse } from './ApiQueryListLogevents';
import { ApiQueryListQuerypageRequest, ApiQueryListQuerypageResponse } from './ApiQueryListQuerypage';
import { ApiQueryListAllpagesRequest, ApiQueryListAllpagesResponse } from './ApiQueryListAllpages';
import { ApiQueryMetaAllmessagesRequest, ApiQueryMetaAllmessagesResponse } from './ApiQueryMetaAllmessages';
import { ApiUploadRequest } from './ApiUpload';
import { ApiEditRequest } from './ApiEdit';
import { UnionToIntersection } from '../util';

export interface ApiRequestBase {
	action : string;
	format? : 'json';
	formatversion? : 2;
	[ key : string ] : string|number|readonly (string|number)[]|Date|undefined;
}

export interface ApiQueryRequest extends ApiRequestBase {
	action : 'query'
	list? : string|readonly string[];
	meta? : string|readonly string[];
	prop? : string|readonly string[];
}

// Object to allow external augementation
interface KnownApiRequestsObj {
	Edit                   : ApiEditRequest;
	Parse                  : ApiParseRequest;
	QueryListAllpages      : ApiQueryListAllpagesRequest;
	QueryListAllusers      : ApiQueryListAllusersRequest;
	QueryListLogevents     : ApiQueryListLogeventsRequest;
	QueryListQuerypage     : ApiQueryListQuerypageRequest;
	QueryListRecentChanges : ApiQueryListRecentChangesRequest;
	QueryListUsers         : ApiQueryListUsersRequest;
	QueryMetaAllmessages   : ApiQueryMetaAllmessagesRequest;
	QueryMetaSiteinfo      : ApiQueryMetaSiteinfoRequest;
	QueryMetaTokens        : ApiQueryMetaTokensRequest;
	QueryMetaUserinfo      : ApiQueryMetaUserinfoRequest;
	QueryPage              : ApiQueryPageRequest;
	Upload                 : ApiUploadRequest;
}

export type KnownApiRequests = KnownApiRequestsObj[keyof KnownApiRequestsObj];

// Object to allow external augementation
interface KnownApiResponsesObj<T extends ApiRequestBase> {
	Parse                  : T extends ApiParseRequest ? ApiParseRequestResponse<T> : never;
	QueryListAllpages      : T extends ApiQueryListAllpagesRequest ? ApiQueryListAllpagesResponse : never;
	QueryListAllusers      : T extends ApiQueryListAllusersRequest ? ApiQueryListAllusersRequestResponse<T> : never;
	QueryListLogevents     : T extends ApiQueryListLogeventsRequest ? ApiQueryListLogeventsRequestResponse<T> : never;
	QueryListQuerypage     : T extends ApiQueryListQuerypageRequest ? ApiQueryListQuerypageResponse : never;
	QueryListRecentChanges : T extends ApiQueryListRecentChangesRequest ? ApiQueryListRecentChangesRequestResponse<T> : never;
	QueryListUsers         : T extends ApiQueryListUsersRequest ? ApiQueryListUsersRequestResponse<T> : never;
	QueryMetaAllMessages   : T extends ApiQueryMetaAllmessagesRequest ? ApiQueryMetaAllmessagesResponse : never;
	QueryMetaSiteinfo      : T extends ApiQueryMetaSiteinfoRequest ? ApiQueryMetaSiteinfoRequestResponse<T> : never;
	QueryMetaTokens        : T extends ApiQueryMetaTokensRequest ? ApiQueryMetaTokensRequestResponse<T> : never;
	QueryMetaUserinfo      : T extends ApiQueryMetaUserinfoRequest ? ApiQueryMetaUserinfoRequestResponse<T> : never;
	QueryPage              : T extends ApiQueryPageRequest ? ApiQueryPageRequestResponse<T> : never;
}

export type ApiRequestResponse<T extends ApiRequestBase> =
	Exclude<KnownApiResponsesObj<T>[keyof KnownApiResponsesObj<T>], never> extends never
		? T extends ApiQueryRequest
			? ApiQueryResponse
			: ApiResponse
		: UnionToIntersection<KnownApiResponsesObj<T>[keyof KnownApiResponsesObj<T>]>;
