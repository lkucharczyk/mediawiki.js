import { DiscussionAttachments, DiscussionDate, DiscussionPagination, DiscussionUser } from '../Discussions';
import { NirvanaRequestBase } from '../NirvanaRequest';

interface Comment {
	id: `${ bigint }`,
	creationDate: DiscussionDate,
	upvoteCount: number,
	userData: {
		postId: `${ bigint }`,
		hasUpvoted: boolean,
		permissions: {
			canEdit: boolean,
			canDelete: boolean
		},
		isReported: boolean
	},
	jsonModel: string,
	attachments: DiscussionAttachments,
	createdBy: DiscussionUser,
	lastDeletedBy?: DiscussionUser
}

export interface Request extends NirvanaRequestBase {
	controller: 'ArticleComments',
	method: 'getComments',
	title: string,
	namespace: number,
	hideDeleted?: 'true' | 'false',
	page?: number
}

export interface Response {
	links: DiscussionPagination,
	threads: {
		id: `${ bigint }`,
		creationDate: DiscussionDate,
		postId: `${ bigint }`,
		followed: boolean,
		containerId: `${ number }`,
		firstPost: Comment,
		posts: Comment[]
	}[],
	totalCount: number,
	readOnlyMode: boolean
}
