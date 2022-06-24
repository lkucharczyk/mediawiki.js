import { DiscussionForum, DiscussionPagination } from '../Discussions';
import { NirvanaRequestBase } from '../NirvanaRequest';
import { NirvanaResponse } from '../NirvanaResponse';

export interface NirvanaDiscussionForumGetForumsRequest extends NirvanaRequestBase {
	controller: 'DiscussionForum',
	method: 'getForums'
}

export interface NirvanaDiscussionForumGetForumsResponse extends DiscussionForum, NirvanaResponse {
	_links: DiscussionPagination,
	_embedded: {
		'doc:forum': DiscussionForum[]
	}
}
