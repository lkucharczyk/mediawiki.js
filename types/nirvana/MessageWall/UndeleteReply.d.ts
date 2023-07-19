import type { NirvanaRequestBase } from '../NirvanaRequest';

export interface Request extends NirvanaRequestBase {
	controller: 'MessageWall',
	method: 'undeleteReply',
	wallOwnerId: number,
	postId: string,
}

// 204: No content; otherwise error
export interface Response {}
