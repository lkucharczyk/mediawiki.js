import { DiscussionDate, DiscussionForum, DiscussionPagination, DiscussionTag, DiscussionUser } from '../Discussions';
import { NirvanaRequestBase } from '../NirvanaRequest';
import { NirvanaResponse } from '../NirvanaResponse';

export interface NirvanaDiscussionThreadGetThreadsRequest extends NirvanaRequestBase {
	controller: 'DiscussionThread',
	method: 'getThreads',
	limit?: number,
	page?: number,
	sortKey?: string,
	forumId?: string
}

export interface NirvanaDiscussionThreadGetThreadsResponse extends NirvanaResponse {
	_links: DiscussionPagination,
	_embedded: {
		forums: DiscussionForum[],
		threads: {
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
		}[]
	},
	postCount: number,
	readOnlyMode: boolean,
	requesterId: string,
	siteId: number,
	threadCount: number
}
