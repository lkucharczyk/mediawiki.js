import { NirvanaActivityApi } from './ActivityApi/GetSocialActivity';
import { NirvanaArticleComments } from './ArticleComments';
import { NirvanaDiscussionContribution } from './DiscussionContribution';
import { NirvanaDiscussionForumGetForumsRequest, NirvanaDiscussionForumGetForumsResponse } from './DiscussionForum/GetForums';
import { NirvanaDiscussionPostGetPostsRequest, NirvanaDiscussionPostGetPostsResponse } from './DiscussionPost/GetPosts';
import { NirvanaDiscussionThread } from './DiscussionThread';
import { NirvanaFeedsAndPosts } from './FeedsAndPosts';
import { NirvanaMercuryApiGetWikiVariablesRequest, NirvanaMercuryApiGetWikiVariablesResponse } from './MercuryApiController/GetWikiVariables';
import { NirvanaMessageWall } from './MessageWall';
import { NirvanaUserApiGetDetailsRequest, NirvanaUserApiGetDetailsResponse } from './UsersApiController/GetDetails';
import { NirvanaUserApiGetUsersByNameRequest, NirvanaUserApiGetUsersByNameResponse } from './UsersApiController/GetUsersByName';
import { NirvanaWikisApiGetDetailsRequest, NirvanaWikisApiGetDetailsRequestResponse } from './WikisApiController/GetDetails';
import { NirvanaWikisApiGetWikisUnderDomainRequest, NirvanaWikisApiGetWikisUnderDomainResponse } from './WikisApiController/GetWikisUnderDomain';

export interface NirvanaRequestBase {
	controller: string,
	method: string,
	[ key: string ]: string|number|boolean|readonly ( string|number )[]|Record<string, any>|undefined
}

// Object to allow external augementation
export interface KnownNirvanaRequests {
	ActivityApi: {
		getSocialActivity:   NirvanaActivityApi.GetSocialActivity.Request
	},
	ArticleComments:         NirvanaArticleComments.Request,
	DiscussionContribution:  NirvanaDiscussionContribution.Request,
	DiscussionForum: {
		getForums:           NirvanaDiscussionForumGetForumsRequest
	},
	DiscussionPost: {
		getPosts:            NirvanaDiscussionPostGetPostsRequest
	},
	DiscussionThread:        NirvanaDiscussionThread.Request,
	FeedsAndPosts:           NirvanaFeedsAndPosts.Request,
	MercuryApi: {
		getWikiVariables:    NirvanaMercuryApiGetWikiVariablesRequest
	},
	MessageWall:             NirvanaMessageWall.Request,
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
export interface KnownNirvanaResponses<T> {
	ActivityApi: {
		getSocialActivity:   NirvanaActivityApi.GetSocialActivity.Response
	},
	ArticleComments:         NirvanaArticleComments.Response,
	DiscussionContribution:  NirvanaDiscussionContribution.Response,
	DiscussionForum: {
		getForums:           NirvanaDiscussionForumGetForumsResponse
	},
	DiscussionPost: {
		getPosts:            NirvanaDiscussionPostGetPostsResponse
	},
	DiscussionThread:        NirvanaDiscussionThread.Response,
	FeedsAndPosts:           NirvanaFeedsAndPosts.Response<T>,
	MercuryApi: {
		getWikiVariables:    NirvanaMercuryApiGetWikiVariablesResponse
	},
	MessageWall:             NirvanaMessageWall.Response<T>,
	UserApi: {
		getDetails:          NirvanaUserApiGetDetailsResponse,
		getUsersByName:      NirvanaUserApiGetUsersByNameResponse
	},
	WikisApi: {
		getDetails:          T extends NirvanaWikisApiGetDetailsRequest ? NirvanaWikisApiGetDetailsRequestResponse<T> : never,
		getWikisUnderDomain: NirvanaWikisApiGetWikisUnderDomainResponse
	}
}

export type KnownNirvanaController = keyof KnownNirvanaRequests;
export type KnownNirvanaRequest = {
	[C in KnownNirvanaController]: {
		[M in keyof KnownNirvanaRequests[C]]: KnownNirvanaRequests[C][M]
	}[keyof KnownNirvanaRequests[C]]
}[KnownNirvanaController];
export type KnownNirvanaResponse<R extends KnownNirvanaRequest> = KnownNirvanaResponses<R>[R['controller']][R['method'] & keyof KnownNirvanaResponses<R>[R['controller']]];
