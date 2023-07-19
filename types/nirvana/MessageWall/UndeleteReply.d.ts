import type { NirvanaRequestBase } from '../NirvanaRequest';

export interface Request extends NirvanaRequestBase {
	controller: 'MessageWall',
	method: 'undeleteReply',
	wallOwnerId: number,
	postId: string,
	token: string
}

// 204: No content; otherwise error
export interface Response {}
