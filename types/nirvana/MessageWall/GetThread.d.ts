import { DiscussionPagination, DiscussionPost, DiscussionThread } from '../Discussions';

export type ResponseGroup = 'small' | 'full';

export interface Request {
	controller: 'MessageWall',
	method: 'getThread',
	wallOwnerId: number,
	threadId: `${ bigint }`,
	responseGroup?: ResponseGroup,
	viewableOnly?: boolean,
	limit?: number
}

export interface Response<G extends ResponseGroup = 'small'> extends DiscussionThread {
	_links: DiscussionPagination,
	_embedded: {
		firstPost: [ DiscussionPost ],
		'doc:posts': G extends 'full' ? DiscussionPost[] : undefined
	},
	postCount: number,
	readOnlyMode: boolean,
	requesterId: string,
	siteId: number
}

export type RequestResponse<R extends Request> = Response<R['responseGroup'] extends ResponseGroup ? R['responseGroup'] : 'small'>;
