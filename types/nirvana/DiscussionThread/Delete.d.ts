// https://luq.fandom.com/wikia.php?controller=DiscussionThread&method=delete&threadId=4400000000000002148

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
