import * as methodCreateThread from './CreateThread';
import * as methodDeleteReply from './DeleteReply';
import * as methodGetThread from './GetThread';
import * as methodGetThreads from './GetThreads';
import * as methodUndeleteReply from './UndeleteReply';

export namespace NirvanaMessageWall {
	export namespace CreateThread {
		export type Request = methodCreateThread.Request;
		export type Response = methodCreateThread.Response;
	}

	export namespace DeleteReply {
		export type Request = methodDeleteReply.Request;
		export type Response = methodDeleteReply.Response;
	}

	export namespace GetThread {
		export type Request = methodGetThread.Request;
		export type Response = methodGetThread.Response;
	}

	export namespace GetThreads {
		export type Request = methodGetThreads.Request;
		export type Response = methodGetThreads.Response;
	}

	export namespace UndeleteReply {
		export type Request = methodUndeleteReply.Request;
		export type Response = methodUndeleteReply.Response;
	}

	export interface Request {
		createThread: methodCreateThread.Request,
		deleteReply: methodDeleteReply.Request,
		getThread: methodGetThread.Request,
		getThreads: methodGetThreads.Request,
		undeleteReply: methodUndeleteReply.Request
	}

	export interface Response<T> {
		createThread: methodCreateThread.Response,
		deleteReply: methodDeleteReply.Response,
		getThread: T extends methodGetThread.Request ? methodGetThread.RequestResponse<T> : never,
		getThreads: methodGetThreads.Response,
		undeleteReply: methodUndeleteReply.Response
	}
}
