import type { DiscussionPagination, DiscussionThread } from '../Discussions';
import type { NirvanaRequestBase } from '../NirvanaRequest';

export interface Request extends NirvanaRequestBase {
	controller: 'DiscussionThread',
	method: 'undelete',
	threadId: string
}

export interface Response extends DiscussionThread {
	_links: DiscussionPagination
}
