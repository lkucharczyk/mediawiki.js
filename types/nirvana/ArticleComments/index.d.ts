import * as methodGetComments from './GetComments';

export namespace NirvanaArticleComments {
	export namespace GetComments {
		export type Request = methodGetComments.Request;
		export type Response = methodGetComments.Response;
	}

	export interface Request {
		getComments: methodGetComments.Request
	}

	export interface Response {
		getComments: methodGetComments.Response
	}
}
