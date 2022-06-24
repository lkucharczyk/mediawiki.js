import { NirvanaDiscussionForumGetForumsRequest, NirvanaDiscussionForumGetForumsResponse } from './DiscussionForum/GetForums';
import { NirvanaDiscussionThreadGetThreadsRequest, NirvanaDiscussionThreadGetThreadsResponse } from './DiscussionThreadController/GetThreads';
import { NirvanaMercuryApiGetWikiVariablesRequest, NirvanaMercuryApiGetWikiVariablesResponse } from './MercuryApiController/GetWikiVariables';
import { NirvanaUserApiGetDetailsRequest, NirvanaUserApiGetDetailsResponse } from './UsersApiController/GetDetails';
import { NirvanaUserApiGetUsersByNameRequest, NirvanaUserApiGetUsersByNameResponse } from './UsersApiController/GetUsersByName';
import { NirvanaWikisApiGetDetailsRequest, NirvanaWikisApiGetDetailsRequestResponse } from './WikisApiController/GetDetails';
import { NirvanaWikisApiGetWikisUnderDomainRequest, NirvanaWikisApiGetWikisUnderDomainResponse } from './WikisApiController/GetWikisUnderDomain';

export interface NirvanaRequestBase {
	controller: string,
	method: string,
	[ key : string ]: string|number|readonly (string|number)[]|undefined
}

// Object to allow external augementation
export interface KnownNirvanaRequestsObj {
	DiscussionForum_getForum    : NirvanaDiscussionForumGetForumsRequest,
	DiscussionThread_getThreads : NirvanaDiscussionThreadGetThreadsRequest,
	MercuryApi_getWikiVariables : NirvanaMercuryApiGetWikiVariablesRequest,
	UserApi_getDetails          : NirvanaUserApiGetDetailsRequest,
	UserApi_getUsersByName      : NirvanaUserApiGetUsersByNameRequest,
	WikisApi_getDetails         : NirvanaWikisApiGetDetailsRequest,
	WikisApi_getWikisUnderDomain: NirvanaWikisApiGetWikisUnderDomainRequest
}

export type KnownNirvanaRequests = KnownNirvanaRequestsObj[keyof KnownNirvanaRequestsObj];

// Object to allow external augementation
export interface KnownNirvanaResponsesObj<T extends NirvanaRequestBase> {
	DiscussionForum_getForum    : T extends NirvanaDiscussionForumGetForumsRequest ? NirvanaDiscussionForumGetForumsResponse : never,
	DiscussionThread_getThreads : T extends NirvanaDiscussionThreadGetThreadsRequest ? NirvanaDiscussionThreadGetThreadsResponse : never,
	MercuryApi_getWikiVariables : T extends NirvanaMercuryApiGetWikiVariablesRequest ? NirvanaMercuryApiGetWikiVariablesResponse : never,
	UserApi_getDetails          : T extends NirvanaUserApiGetDetailsRequest ? NirvanaUserApiGetDetailsResponse : never,
	UserApi_getUsersByName      : T extends NirvanaUserApiGetUsersByNameRequest ? NirvanaUserApiGetUsersByNameResponse : never,
	WikisApi_getDetails         : T extends NirvanaWikisApiGetDetailsRequest ? NirvanaWikisApiGetDetailsRequestResponse<T> : never,
	WikisApi_getWikisUnderDomain: T extends NirvanaWikisApiGetWikisUnderDomainRequest ? NirvanaWikisApiGetWikisUnderDomainResponse : never
}

export type KnownNirvanaResponses<T extends NirvanaRequestBase> =
	Exclude<KnownNirvanaResponsesObj<T>[keyof KnownNirvanaResponsesObj<T>], never> extends never
		? never
		: KnownNirvanaResponsesObj<T>[keyof KnownNirvanaResponsesObj<T>];
