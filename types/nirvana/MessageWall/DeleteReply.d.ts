import type { NirvanaRequestBase } from '../NirvanaRequest';

export interface Request extends NirvanaRequestBase {
	controller: 'MessageWall',
	method: 'deleteReply',
	wallOwnerId: number,
	postId: string,
	suppressContent: 'true' | 'false',
	token: string
}

// 204: No content; otherwise error
export interface Response {}
