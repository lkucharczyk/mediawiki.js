export interface DiscussionDate {
	epochSecond: number,
	/** @deprecated */
	nano: 0
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
