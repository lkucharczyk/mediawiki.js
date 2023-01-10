import { DiscussionAttachments, DiscussionDate, DiscussionJsonModel, DiscussionUser } from '../Discussions';
import { NirvanaRequestBase } from '../NirvanaRequest';
import { NirvanaResponse } from '../NirvanaResponse';

export declare namespace NirvanaMessageWall {
	export namespace CreateThread {
		export interface Request extends NirvanaRequestBase {
			controller: 'MessageWall',
			method: 'createThread',
			wallOwnerId: number,
			title: string,
			rawContent: string,
			jsonModel: DiscussionJsonModel,
			attachments: {
				contentImages: never[],
				openGraphs: never[],
				atMentions: never[]
			},
			token: string
		}

		export interface Response extends NirvanaResponse {
			_links: {
				first: [ { href: string } ]
			},
			createdBy: DiscussionUser,
			creationDate: DiscussionDate,
			firstPostId: string,
			forumId: string,
			forumName: null,
			id: string,
			isDeleted: boolean,
			isEditable: boolean,
			isFollowed: boolean,
			isLocked: boolean,
			isReported: boolean,
			jsonModel: string,
			lastPostId: 0,
			latestRevisionId: string,
			modificationDate: null,
			postCount: 0,
			rawContent: string,
			renderedContent: null,
			requesterId: string,
			siteId: string,
			source: 'UNCATEGORIZED',
			tags: null,
			title: string,
			trendingScore: 0,
			upvoteCount: 0,
			_embedded: {
				contentImages: [],
				attachments: DiscussionAttachments,
				userData: [ {
					hasReported: false,
					hasUpvoted: false
				} ],
				firstPost: [ {
					_links: {
						permalink: [ { href: string } ]
					},
					createdBy: DiscussionUser,
					creationDate: DiscussionDate,
					creatorId: string,
					creatorIp: '',
					id: string,
					isDeleted: boolean,
					isEditable: boolean,
					isFollowed: boolean,
					isLocked: boolean,
					jsonModel: DiscussionJsonModel,
					latestRevisionId: string,
					modificationDate: null,
					position: 1,
					rawContent: string,
					renderedContent: null,
					requesterId: string,
					siteId: string,
					threadId: string,
					title: string,
					upvoteCount: 0,
					_embedded: {
						attachments: DiscussionAttachments,
						contentImages: [],
						userData: [ {
							hasReported: boolean,
							hasUpvoted: boolean
						} ]
					}
				} ]
			}
		}
	}
}
