import * as methodDeletePost from './DeletePost';
import * as methodGetComments from './GetComments';
import * as methodGetThread from './GetThread';
import * as methodUndeletePost from './UndeletePost';

export namespace NirvanaArticleComments {
	export namespace DeletePost {
		export type Request = methodDeletePost.Request;
		export type Response = methodDeletePost.Response;
	}

	export namespace GetComments {
		export type Request = methodGetComments.Request;
		export type Response = methodGetComments.Response;
	}

	export namespace GetThread {
		export type Request = methodGetThread.Request;
		export type Response = methodGetThread.Response;
	}

	export namespace UndeletePost {
		export type Request = methodUndeletePost.Request;
		export type Response = methodUndeletePost.Response;
	}

	export interface Request {
		deletePost: methodDeletePost.Request,
		getComments: methodGetComments.Request,
		getThread: methodGetThread.Request,
		undeletePost: methodUndeletePost.Request
	}

	export interface Response {
		deletePost: methodDeletePost.Response,
		getComments: methodGetComments.Response,
		getThread: methodGetThread.Response,
		undeletePost: methodUndeletePost.Response
	}
}
