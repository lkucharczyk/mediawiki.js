import { NirvanaActivityApi } from './ActivityApi/GetSocialActivity';
import { NirvanaArticleComments } from './ArticleComments';
import { NirvanaDiscussionForumGetForumsRequest, NirvanaDiscussionForumGetForumsResponse } from './DiscussionForum/GetForums';
import { NirvanaDiscussionPostGetPostsRequest, NirvanaDiscussionPostGetPostsResponse } from './DiscussionPost/GetPosts';
import { NirvanaDiscussionThread } from './DiscussionThread';
import { NirvanaMercuryApiGetWikiVariablesRequest, NirvanaMercuryApiGetWikiVariablesResponse } from './MercuryApiController/GetWikiVariables';
import { NirvanaMessageWall } from './MessageWall';
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
export interface KnownNirvanaRequests {
	ActivityApi: {
		getSocialActivity:   NirvanaActivityApi.GetSocialActivity.Request
	},
	ArticleComments:         NirvanaArticleComments.Request,
	DiscussionForum: {
		getForums:           NirvanaDiscussionForumGetForumsRequest
	},
	DiscussionPost: {
		getPosts:            NirvanaDiscussionPostGetPostsRequest
	},
	DiscussionThread:        NirvanaDiscussionThread.Request,
	MercuryApi: {
		getWikiVariables:    NirvanaMercuryApiGetWikiVariablesRequest
	},
	MessageWall: {
		createThread:        NirvanaMessageWall.CreateThread.Request,
		getThreads:          NirvanaMessageWall.GetThreads.Request
	},
	UserApi: {
		getDetails:          NirvanaUserApiGetDetailsRequest,
		getUsersByName:      NirvanaUserApiGetUsersByNameRequest
	},
	WikisApi: {
		getDetails:          NirvanaWikisApiGetDetailsRequest,
		getWikisUnderDomain: NirvanaWikisApiGetWikisUnderDomainRequest
	}
}

// Object to allow external augementation
export interface KnownNirvanaResponses<T extends NirvanaRequestBase> {
	ActivityApi: {
		getSocialActivity:   NirvanaActivityApi.GetSocialActivity.Response
	},
	ArticleComments:         NirvanaArticleComments.Response,
	DiscussionForum: {
		getForums:           NirvanaDiscussionForumGetForumsResponse
	},
	DiscussionPost: {
		getPosts:            NirvanaDiscussionPostGetPostsResponse
	},
	DiscussionThread:        NirvanaDiscussionThread.Response,
	MercuryApi: {
		getWikiVariables:    NirvanaMercuryApiGetWikiVariablesResponse
	},
	MessageWall: {
		createThread:        NirvanaMessageWall.CreateThread.Response,
		getThreads:          NirvanaMessageWall.GetThreads.Response
	},
	UserApi: {
		getDetails:          NirvanaUserApiGetDetailsResponse,
		getUsersByName:      NirvanaUserApiGetUsersByNameResponse
	},
	WikisApi: {
		getDetails:          T extends NirvanaWikisApiGetDetailsRequest ? NirvanaWikisApiGetDetailsRequestResponse<T> : never,
		getWikisUnderDomain: NirvanaWikisApiGetWikisUnderDomainResponse
	}
}
