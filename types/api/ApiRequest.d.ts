import { ApiQueryResponse, ApiResponse } from './ApiResponse';
import { ApiQueryMetaTokensRequest, ApiQueryMetaTokensRequestResponse } from './ApiQueryMetaTokens';
import { ApiQueryMetaUserinfoRequest, ApiQueryMetaUserinfoRequestResponse } from './ApiQueryMetaUserinfo';
import { ApiParseRequest, ApiParseRequestResponse } from './ApiParse';
import { ApiQueryListUsersRequest, ApiQueryListUsersRequestResponse } from './ApiQueryListUsers';
import { ApiQueryPageRequest, ApiQueryPageRequestResponse } from './ApiQueryPage';
import { ApiQueryListAllusers } from './ApiQueryListAllusers';
import { ApiQueryListRecentChangesRequest, ApiQueryListRecentChangesRequestResponse } from './ApiQueryListRecentchanges';
import { ApiQueryListLogeventsRequest, ApiQueryListLogeventsRequestResponse } from './ApiQueryListLogevents';
import { ApiQueryListQuerypageRequest, ApiQueryListQuerypageResponse } from './ApiQueryListQuerypage';
import { ApiQueryListAllpages } from './ApiQueryListAllpages';
import { ApiQueryMetaAllmessagesRequest, ApiQueryMetaAllmessagesResponse } from './ApiQueryMetaAllmessages';
import { ApiQueryMetaSiteinfo } from './ApiQueryMetaSiteinfo';
import { ApiEdit } from './ApiEdit';
import { ApiImportRequest, ApiImportResponse } from './ApiImport';
import { ApiUploadRequest } from './ApiUpload';
import { UnionToIntersection } from '../util';

export interface ApiRequestBase {
	action: string,
	format?: 'json',
	formatversion?: 2,
	[key: string]: string|number|readonly ( string|number )[]|Date|undefined
}

export interface ApiQueryRequest extends ApiRequestBase {
	action: 'query'
	list?: string|readonly string[],
	meta?: string|readonly string[],
	prop?: string|readonly string[]
}

// Object to allow external augementation
interface KnownApiRequestsObj {
	Edit                   : ApiEdit.Request,
	Import                 : ApiImportRequest,
	Parse                  : ApiParseRequest,
	QueryListAllpages      : ApiQueryListAllpages.Request,
	QueryListAllusers      : ApiQueryListAllusers.Request,
	QueryListLogevents     : ApiQueryListLogeventsRequest,
	QueryListQuerypage     : ApiQueryListQuerypageRequest,
	QueryListRecentChanges : ApiQueryListRecentChangesRequest,
	QueryListUsers         : ApiQueryListUsersRequest,
	QueryMetaAllmessages   : ApiQueryMetaAllmessagesRequest,
	QueryMetaSiteinfo      : ApiQueryMetaSiteinfo.Request,
	QueryMetaTokens        : ApiQueryMetaTokensRequest,
	QueryMetaUserinfo      : ApiQueryMetaUserinfoRequest,
	QueryPage              : ApiQueryPageRequest,
	Upload                 : ApiUploadRequest
}

export type KnownApiRequests = KnownApiRequestsObj[keyof KnownApiRequestsObj];

// Object to allow external augementation
interface KnownApiResponsesObj<T extends ApiRequestBase> {
	Edit                   : T extends ApiEdit.Request ? ApiEdit.Response : never,
	Parse                  : T extends ApiParseRequest ? ApiParseRequestResponse<T> : never,
	Import                 : T extends ApiImportRequest ? ApiImportResponse : never,
	QueryListAllpages      : T extends ApiQueryListAllpages.Request ? ApiQueryListAllpages.Response : never,
	QueryListAllusers      : T extends ApiQueryListAllusers.Request ? ApiQueryListAllusers.RequestResponse<T> : never,
	QueryListLogevents     : T extends ApiQueryListLogeventsRequest ? ApiQueryListLogeventsRequestResponse<T> : never,
	QueryListQuerypage     : T extends ApiQueryListQuerypageRequest ? ApiQueryListQuerypageResponse : never,
	QueryListRecentChanges : T extends ApiQueryListRecentChangesRequest ? ApiQueryListRecentChangesRequestResponse<T> : never,
	QueryListUsers         : T extends ApiQueryListUsersRequest ? ApiQueryListUsersRequestResponse<T> : never,
	QueryMetaAllMessages   : T extends ApiQueryMetaAllmessagesRequest ? ApiQueryMetaAllmessagesResponse : never,
	QueryMetaSiteinfo      : T extends ApiQueryMetaSiteinfo.Request ? ApiQueryMetaSiteinfo.RequestResponse<T> : never,
	QueryMetaTokens        : T extends ApiQueryMetaTokensRequest ? ApiQueryMetaTokensRequestResponse<T> : never,
	QueryMetaUserinfo      : T extends ApiQueryMetaUserinfoRequest ? ApiQueryMetaUserinfoRequestResponse<T> : never,
	QueryPage              : T extends ApiQueryPageRequest ? ApiQueryPageRequestResponse<T> : never
}

export type ApiRequestResponse<T extends ApiRequestBase> =
	Exclude<KnownApiResponsesObj<T>[keyof KnownApiResponsesObj<T>], never> extends never
		? T extends ApiQueryRequest
			? ApiQueryResponse
			: ApiResponse
		: UnionToIntersection<KnownApiResponsesObj<T>[keyof KnownApiResponsesObj<T>]>;
