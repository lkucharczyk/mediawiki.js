import * as methodCreateThread from './CreateThread';
import * as methodGetThreads from './GetThreads';

export namespace NirvanaMessageWall {
	export namespace CreateThread {
		export type Request = methodCreateThread.Request;
		export type Response = methodCreateThread.Response;
	}

	export namespace GetThreads {
		export type Request = methodGetThreads.Request;
		export type Response = methodGetThreads.Response;
	}
}
