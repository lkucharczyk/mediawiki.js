import { DiscussionAttachments, DiscussionDate, DiscussionPagination, DiscussionPermalink, DiscussionPost, DiscussionTag, DiscussionUser } from '../Discussions';
import { NirvanaRequestBase } from '../NirvanaRequest';
import { NirvanaResponse } from '../NirvanaResponse';

type ContainerType = 'ARTICLE_COMMENT'|'FORUM'|'WALL';

export interface NirvanaDiscussionPostGetPostsRequest extends NirvanaRequestBase {
	controller: 'DiscussionPost',
	method: 'getPosts',
	containerType: ContainerType,
	limit?: number,
	viewableOnly?: 'true' | 'false',
	reported?: 'true' | 'false'
}

export interface NirvanaDiscussionPostGetPostsResponse extends NirvanaResponse {
	_links: DiscussionPagination,
	_embedded: {
		count: [ {
			ARTICLE_COMMENT: number,
			FORUM: number
		} ],
		contributors: [ {
			count: 0,
			userInfo: DiscussionUser[]
		} ],
		wallOwners: {
			userId: string,
			wallContainerId: string
		}[],
		'doc:posts': DiscussionPost & {
			_links: DiscussionPermalink,
			createdBy: DiscussionUser,
			creationDate: DiscussionDate,
			creatorId: string,
			forumId: string,
			forumName: string | null,
			isDeleted: boolean,
			isLocked: boolean,
			isReply: boolean,
			isReported: boolean,
			jsonModel: string,
			lastEditedBy?: DiscussionUser,
			latestRevisionId: string,
			modificationDate: DiscussionDate|null,
			position: number,
			rawContent?: string,
			// renderedContent: null
			siteId: string,
			threadCreatedBy: DiscussionUser,
			threadId: string,
			title: string | null,
			upvoteCount: 0,
			_embedded: {
				// contentImages: [],
				attachments: DiscussionAttachments,
				thread: {
					containerId: string,
					containerType: ContainerType,
					creatorId: string,
					isEditable: boolean,
					isLocked: boolean,
					isReported: boolean,
					postCount: string,
					tags: DiscussionTag[],
					title: string
				}[],
				latestRevision: {
					creationDate: DiscussionDate,
					creatorId: string,
					creatorIp: string,
					id: string,
					jsonModel: string,
					postId: string,
					rawContent: string
				}[]
			}
		}[]
	},
	postCount: string,
	readOnlyMode: boolean
}
