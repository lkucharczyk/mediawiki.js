import { NirvanaRequestBase } from '../NirvanaRequest';
import { NirvanaResponse } from '../NirvanaResponse';

interface DiscussionDate {
	epochSecond : number;
}

interface DiscussionUser {
	id : string;
	avatarUrl : string;
	name : string;
	badgePermission : string;
}

export interface NirvanaDiscussionThreadGetThreadsRequest extends NirvanaRequestBase {
	controller : 'DiscussionThread';
	method : 'getThreads';
	limit? : number;
	page? : number;
	sortKey? : string;
}

export interface NirvanaDiscussionThreadGetThreadsResponse extends NirvanaResponse {
	_links : {
		first? : [
			{ href : string }
		];
		next? : [
			{ href : string }
		];
	};
	_embedded : {
		forums : {
			allowsThreads : boolean;
			creationDate : DiscussionDate;
			creatorId : string;
			description : string;
			displayOrder : number;
			id : string;
			name : string;
			parentId : string;
			postCount : number;
			recentContributors: DiscussionUser[];
			threadCount : number;
		}[];
		threads : {
			createdBy : DiscussionUser;
			creationDate : DiscussionDate;
			forumId : string;
			forumName : string;
			id : string;
			lastEditedBy : DiscussionUser;
			rawContent : string;
			title : string;
			trendingScore : number;
			upvoteCount : number;
		}[];
	};
	postCount : number;
	readOnlyMode : boolean;
	requesterId : string;
	siteId : number;
	threadCount : number;
}
