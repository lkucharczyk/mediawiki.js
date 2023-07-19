import * as methodGetArticleNamesAndUsernames from './GetArticleNamesAndUsernames';

export namespace NirvanaFeedsAndPosts {
	export namespace GetArticleNamesAndUsernames {
		export type Request = methodGetArticleNamesAndUsernames.Request;
		export type Response = methodGetArticleNamesAndUsernames.Response;
		export type RequestResponse<R extends Request> = methodGetArticleNamesAndUsernames.RequestResponse<R>;
	}

	export interface Request {
		getArticleNamesAndUsernames: methodGetArticleNamesAndUsernames.Request
	}

	export interface Response<T> {
		getArticleNamesAndUsernames: T extends methodGetArticleNamesAndUsernames.Request ? methodGetArticleNamesAndUsernames.Response : never
	}
}
