import { DiscussionAttachments, DiscussionDate, DiscussionPagination, DiscussionUser } from '../Discussions';

export interface CommentThread {
	id: `${ bigint }`,
	creationDate: DiscussionDate,
	postId: `${ bigint }`,
	followed: boolean,
	containerId: `${ number }`,
	firstPost: Comment,
	posts: Comment[]
}

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
	lastDeletedBy?: DiscussionUser,
	lastEditedBy?: DiscussionUser
}

export interface Request {
	controller: 'ArticleComments',
	method: 'getComments',
	title: string,
	namespace: number,
	hideDeleted?: 'true' | 'false',
	page?: number
}

export interface Response {
	links: DiscussionPagination,
	threads: CommentThread[],
	totalCount: number,
	readOnlyMode: boolean
}
