import { ContainerType } from '../DiscussionPost/GetPosts';
import { DiscussionPagination, DiscussionPost, DiscussionUser } from '../Discussions';
import { ResponseGroup } from '../MessageWall/GetThread';

export interface Request {
	controller: 'DiscussionContribution',
	method: 'getPosts',
	userId: number,
	containerType?: ContainerType,
	responseGroup?: ResponseGroup,
	viewableOnly?: boolean,
	page?: number,
	limit?: number
}

interface Post extends DiscussionPost {
	forumId: `${ bigint }`,
	lastDeletedBy?: DiscussionUser,
	title: string | null
}

export interface Response {
	_links: DiscussionPagination,
	postCount: `${ number }`,
	readOnlyMode: boolean,
	_embedded: {
		count: [ Record<ContainerType | 'total', number> ],
		contributors: [ {
			count: 1,
			userInfo: [ DiscussionUser ]
		} ],
		'doc:posts': Post[]
	}
}
