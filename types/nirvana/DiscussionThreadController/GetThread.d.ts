import { DiscussionDate, DiscussionPagination, DiscussionTag, DiscussionUser } from '../Discussions';
import { NirvanaRequestBase } from '../NirvanaRequest';

export namespace NirvanaDiscussionThread {
	export namespace GetThread {
		export interface Request extends NirvanaRequestBase {
			controller: 'DiscussionThread',
			method: 'getThread',
			threadId: string,
			viewableOnly?: 'true' | 'false'
		}

		export interface Response {
			_links: DiscussionPagination,
			createdBy: DiscussionUser,
			creationDate: DiscussionDate,
			forumId: string,
			forumName: string,
			id: string,
			lastEditedBy: DiscussionUser,
			rawContent: string,
			tags: DiscussionTag[],
			title: string,
			trendingScore: number,
			upvoteCount: number
		}
	}
}
