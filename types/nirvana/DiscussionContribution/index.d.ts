import * as methodGetPosts from './GetPosts';

export namespace NirvanaDiscussionContribution {
	export namespace GetPosts {
		export type Request = methodGetPosts.Request;
		export type Response = methodGetPosts.Response;
	}

	export interface Request {
		getPosts: methodGetPosts.Request
	}

	export interface Response {
		getPosts: methodGetPosts.Response
	}
}
