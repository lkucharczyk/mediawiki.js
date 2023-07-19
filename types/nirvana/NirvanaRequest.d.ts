import { NirvanaActivityApi } from './ActivityApi/GetSocialActivity';
import { NirvanaArticleComments } from './ArticleComments';
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
	FeedsAndPosts:           NirvanaFeedsAndPosts.Response<T>,
	MercuryApi: {
		getWikiVariables:    NirvanaMercuryApiGetWikiVariablesResponse
	},
	MessageWall: NirvanaMessageWall.Response,
	UserApi: {
		getDetails:          NirvanaUserApiGetDetailsResponse,
		getUsersByName:      NirvanaUserApiGetUsersByNameResponse
	},
	WikisApi: {
		getDetails:          T extends NirvanaWikisApiGetDetailsRequest ? NirvanaWikisApiGetDetailsRequestResponse<T> : never,
		getWikisUnderDomain: NirvanaWikisApiGetWikisUnderDomainResponse
	}
}
