import * as methodDelete from './Delete';
import * as methodGetThread from './GetThread';
import * as methodGetThreads from './GetThreads';
import * as methodUndelete from './Undelete';

export namespace NirvanaDiscussionThread {
	export namespace Delete {
		export type Request = methodDelete.Request;
		export type Response = methodDelete.Response;
	}

	export namespace GetThread {
		export type Request = methodGetThread.Request;
		export type Response = methodGetThread.Response;
	}

	export namespace GetThreads {
		export type Request = methodGetThreads.Request;
		export type Response = methodGetThreads.Response;
	}

	export namespace Undelete {
		export type Request = methodUndelete.Request;
		export type Response = methodUndelete.Response;
	}

	export interface Request {
		delete: methodDelete.Request,
		getThread: methodGetThread.Request,
		getThreads: methodGetThreads.Request,
		undelete: methodUndelete.Request
	}

	export interface Response {
		delete: methodDelete.Response,
		getThread: methodGetThread.Response,
		getThreads: methodGetThreads.Response,
		undelete: methodUndelete.Response
	}
}
