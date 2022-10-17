import { NirvanaRequestBase } from '../NirvanaRequest';

export declare namespace NirvanaMessageWall {
	export namespace CreateThread {
		export interface Request extends NirvanaRequestBase {
			controller: 'MessageWall',
			method: 'createThread',
			wallOwnerId: number,
			title: string,
			rawContent: string,
			jsonModel?: unknown,
			attachments?: unknown,
			token: string
		}
	}
}
