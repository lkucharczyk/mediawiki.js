export interface DiscussionDate {
	epochSecond: number,
	/** @deprecated */
	nano: number
}

export interface DiscussionUser {
	id: string,
	avatarUrl: string|null,
	name: string,
	badgePermission: string
}

export interface DiscussionPagination {
	first?: [ { href: string } ],
	last?: [ { href: string } ],
	next?: [ { href: string } ]
}

export interface DiscussionJsonModel {
	type: 'doc',
	content: {
		type: 'paragraph',
		content: {
			type: 'text',
			text: string
		}[]
	}[]
}

export interface DiscussionPermalink {
	permalink: [ { href: string } ]
}

export interface DiscussionAttachments {
	atMentions: DiscussionUser[],
	contentImages: unknown[],
	openGraphs: unknown[],
	polls: unknown[],
	quizzes: unknown[]
}

export interface DiscussionTag {
	siteId: string,
	articleId: string,
	articleTitle: string,
	relativeUrl: string
}

export interface DiscussionForum {
	allowThreads: boolean,
	creationDate: DiscussionDate,
	creatorId: string,
	description: string,
	displayOrder: 1,
	id: string,
	isDeleted: boolean,
	isEditable: boolean,
	isLocked: boolean,
	name: string,
	parentId: string,
	postCount: number,
	recentContributors: DiscussionUser[],
	siteId: string,
	threadCount: number
}
