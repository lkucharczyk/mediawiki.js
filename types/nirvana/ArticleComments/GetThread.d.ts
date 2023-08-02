import { CommentThread } from './GetComments';

export interface Request {
	controller: 'ArticleComments',
	method: 'getThread',
	namespace: number,
	title: string,
	threadId: `${ bigint }`,
	hideDeleted?: boolean
}

export interface Response {
	thread: CommentThread | null
}
