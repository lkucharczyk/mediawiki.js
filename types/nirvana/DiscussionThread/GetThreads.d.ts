import { DiscussionForum, DiscussionPagination, DiscussionThread } from '../Discussions';
import { NirvanaRequestBase } from '../NirvanaRequest';
import { NirvanaResponse } from '../NirvanaResponse';

export interface Request extends NirvanaRequestBase {
	controller: 'DiscussionThread',
	method: 'getThreads',
	limit?: number,
	page?: number,
	sortKey?: string,
	forumId?: string
}

export interface Response extends NirvanaResponse {
	_links: DiscussionPagination,
	_embedded: {
		forums: DiscussionForum[],
		threads: DiscussionThread[]
	},
	postCount: number,
	readOnlyMode: boolean,
	requesterId: string,
	siteId: number,
	threadCount: number
}
