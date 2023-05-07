import { NirvanaActivityApi } from './ActivityApi/GetSocialActivity';
import { NirvanaDiscussionForumGetForumsRequest, NirvanaDiscussionForumGetForumsResponse } from './DiscussionForum/GetForums';
import { NirvanaDiscussionPostGetPostsRequest, NirvanaDiscussionPostGetPostsResponse } from './DiscussionPost/GetPosts';
import { NirvanaDiscussionThread } from './DiscussionThreadController/GetThread';
import { NirvanaDiscussionThreadGetThreadsRequest, NirvanaDiscussionThreadGetThreadsResponse } from './DiscussionThreadController/GetThreads';
import { NirvanaMercuryApiGetWikiVariablesRequest, NirvanaMercuryApiGetWikiVariablesResponse } from './MercuryApiController/GetWikiVariables';
import { NirvanaMessageWall } from './MessageWall/CreateThread';
import { NirvanaUserApiGetDetailsRequest, NirvanaUserApiGetDetailsResponse } from './UsersApiController/GetDetails';
import { NirvanaUserApiGetUsersByNameRequest, NirvanaUserApiGetUsersByNameResponse } from './UsersApiController/GetUsersByName';
import { NirvanaWikisApiGetDetailsRequest, NirvanaWikisApiGetDetailsRequestResponse } from './WikisApiController/GetDetails';
import { NirvanaWikisApiGetWikisUnderDomainRequest, NirvanaWikisApiGetWikisUnderDomainResponse } from './WikisApiController/GetWikisUnderDomain';

export interface NirvanaRequestBase {
	controller: string,
	method: string,
	[ key: string ]: string|number|readonly ( string|number )[]|Record<string, any>|undefined
}

// Object to allow external augementation
export interface KnownNirvanaRequestsObj {
	ActivityApi_getSocialActivity: NirvanaActivityApi.GetSocialActivity.Request,
	DiscussionForum_getForum:      NirvanaDiscussionForumGetForumsRequest,
	DiscussionPost_getPosts:       NirvanaDiscussionPostGetPostsRequest,
	DiscussionThread_getThreads:   NirvanaDiscussionThreadGetThreadsRequest,
	DiscussionThread_getThread:    NirvanaDiscussionThread.GetThread.Request,
	MercuryApi_getWikiVariables:   NirvanaMercuryApiGetWikiVariablesRequest,
	MessageWall_createThread:      NirvanaMessageWall.CreateThread.Request,
	UserApi_getDetails:            NirvanaUserApiGetDetailsRequest,
	UserApi_getUsersByName:        NirvanaUserApiGetUsersByNameRequest,
	WikisApi_getDetails:           NirvanaWikisApiGetDetailsRequest,
	WikisApi_getWikisUnderDomain:  NirvanaWikisApiGetWikisUnderDomainRequest
}

export type KnownNirvanaRequests = KnownNirvanaRequestsObj[keyof KnownNirvanaRequestsObj];

// Object to allow external augementation
export interface KnownNirvanaResponsesObj<T extends NirvanaRequestBase> {
	ActivityApi_getSocialActivity: T extends NirvanaActivityApi.GetSocialActivity.Request ? NirvanaActivityApi.GetSocialActivity.Response : never,
	DiscussionForum_getForum:      T extends NirvanaDiscussionForumGetForumsRequest ? NirvanaDiscussionForumGetForumsResponse : never,
	DiscussionPost_getPosts:       T extends NirvanaDiscussionPostGetPostsRequest ? NirvanaDiscussionPostGetPostsResponse : never,
	DiscussionThread_getThreads:   T extends NirvanaDiscussionThreadGetThreadsRequest ? NirvanaDiscussionThreadGetThreadsResponse : never,
	DiscussionThread_getThread:    T extends NirvanaDiscussionThread.GetThread.Request ? NirvanaDiscussionThread.GetThread.Response : never,
	MercuryApi_getWikiVariables:   T extends NirvanaMercuryApiGetWikiVariablesRequest ? NirvanaMercuryApiGetWikiVariablesResponse : never,
	MessageWall_createThread:      T extends NirvanaMessageWall.CreateThread.Request ? NirvanaMessageWall.CreateThread.Response : never,
	UserApi_getDetails:            T extends NirvanaUserApiGetDetailsRequest ? NirvanaUserApiGetDetailsResponse : never,
	UserApi_getUsersByName:        T extends NirvanaUserApiGetUsersByNameRequest ? NirvanaUserApiGetUsersByNameResponse : never,
	WikisApi_getDetails:           T extends NirvanaWikisApiGetDetailsRequest ? NirvanaWikisApiGetDetailsRequestResponse<T> : never,
	WikisApi_getWikisUnderDomain:  T extends NirvanaWikisApiGetWikisUnderDomainRequest ? NirvanaWikisApiGetWikisUnderDomainResponse : never
}

export type KnownNirvanaResponses<T extends NirvanaRequestBase> =
	Exclude<KnownNirvanaResponsesObj<T>[keyof KnownNirvanaResponsesObj<T>], never> extends never
		? never
		: KnownNirvanaResponsesObj<T>[keyof KnownNirvanaResponsesObj<T>];
