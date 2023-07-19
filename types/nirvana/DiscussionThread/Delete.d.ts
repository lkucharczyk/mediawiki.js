import type { DiscussionPagination, DiscussionThread } from '../Discussions';
import type { NirvanaRequestBase } from '../NirvanaRequest';

export interface Request extends NirvanaRequestBase {
	controller: 'DiscussionThread',
	method: 'delete',
	threadId: string,
	supressContent: 'true' | 'false'
}

export interface Response extends DiscussionThread {
	_links: DiscussionPagination
}
