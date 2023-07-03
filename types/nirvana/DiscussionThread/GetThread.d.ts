import type { DiscussionPagination, DiscussionPost, DiscussionThread } from '../Discussions';
import type { NirvanaRequestBase } from '../NirvanaRequest';

export interface Request extends NirvanaRequestBase {
	controller: 'DiscussionThread',
	method: 'getThread',
	threadId: string,
	/** @default 10 */
	limit?: number,
	/** @default 'false' */
	viewableOnly?: 'true' | 'false'
}

export interface Response extends DiscussionThread {
	_links: DiscussionPagination,
	_embedded: {
		'doc:posts'?: DiscussionPost[]
	}
}
