import { DiscussionPagination, DiscussionThread } from '../Discussions';
import { NirvanaRequestBase } from '../NirvanaRequest';
import { NirvanaResponse } from '../NirvanaResponse';

export interface Request extends NirvanaRequestBase {
	controller: 'MessageWall',
	method: 'getThreads',
	wallOwnerId: number,
	hideDeleted?: 'true' | 'false'
}

export interface Response extends NirvanaResponse {
	_links: DiscussionPagination,
	_embedded: {
		threads: DiscussionThread[]
	},
	readOnlyMode: boolean,
	requesterId: string,
	siteId: number,
	/** @deprecated */
	postCount: 0,
	/** @deprecated */
	threadCount: 0
}
