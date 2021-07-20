import { ApiQueryRequest } from './ApiRequest';
import { ApiQueryResponse } from './ApiResponse';

export type ApiQueryListRecentChangesProps = 'comment'|'flags'|'ids'|'loginfo'|'parsedcomment'|'patrolled'|'redirect'|'sha1'|'sizes'|'tags'|'timestamp'|'title'|'user'|'userid';

type ApiQueryListRecentChangesShowBase = 'anon'|'autopatrolled'|'bot'|'minor'|'patrolled'|'redirect'|'unpatrolled';
export type ApiQueryListRecentChangesShow = ApiQueryListRecentChangesShowBase|`!${ ApiQueryListRecentChangesShowBase }`;

export type ApiQueryListRecentChangesType = 'categorize'|'edit'|'external'|'log'|'new';

export interface ApiQueryListRecentChangesRequest extends ApiQueryRequest {
	list : 'recentchanges';
	rccontinue? : string;
	rcdir? : 'newer'|'older';
	rcend? : string|Date;
	rcexcludeuser? : string;
	rclimit? : number|'max';
	rcnamespace? : number|readonly number[];
	rcprop? : ApiQueryListRecentChangesProps|readonly ApiQueryListRecentChangesProps[];
	rcshow? : ApiQueryListRecentChangesShow|readonly ApiQueryListRecentChangesShow[];
	rcstart? : string|Date;
	rctag? : string;
	rctitle? : string;
	rctoponly? : 'true';
	rctype? : ApiQueryListRecentChangesType|readonly ApiQueryListRecentChangesType[];
	rcuser? : string;
}

type RecentChange<P extends ApiQueryListRecentChangesProps> =
	{ type : 'edit'|'log'|'new' }
	& Pick<{
		comment : string;
		parsedcomment : string;
		redirect : boolean;
		tags : string[];
		timestamp : string;
		user : string;
		userid : number;
	}, Extract<P, 'comment'|'parsedcomment'|'redirect'|'tags'|'timestamp'|'user'|'userid'>>
	& ( Extract<P, 'flags'> extends never ? {} : {
		bot : boolean;
		minor : boolean;
		new : boolean;
	} )
	& ( Extract<P, 'ids'> extends never ? {} : {
		old_revid : number;
		pageid : number;
		rcid : number;
		revid : number;
	} )
	& ( Extract<P, 'patrolled'> extends never ? {} : {
		autopatrolled : boolean;
		patrolled : boolean;
		unpatrolled : boolean;
	} )
	& ( Extract<P, 'sizes'> extends never ? {} : {
		newlen : number;
		oldlen : number;
	} )
	& ( Extract<P, 'title'> extends never ? {} : {
		ns : number;
		title : string;
	} )
	& ( Extract<P, 'user'|'userid'> extends never ? {} : { anon? : true } );

type EditRecentChange<P extends ApiQueryListRecentChangesProps> =
	RecentChange<P>
	& { type: 'edit'|'new' }
	& ( Extract<P, 'sha1'> extends never ? {} : { sha1 : string } );

type LogRecentChange<P extends ApiQueryListRecentChangesProps> =
	RecentChange<P>
	& { type: 'log' }
	& ( Extract<P, 'loginfo'> extends never ? {} : {
		logaction : string;
		logid : number;
		logparams : any;
		logtype : string;
	} )
	& ( Extract<P, 'sha1'> extends never ? {} : { sha1? : string } );

export interface ApiQueryListRecentChangesResponse<P extends ApiQueryListRecentChangesProps = 'ids'|'timestamp'|'title'> extends ApiQueryResponse {
	query : {
		recentchanges : ( EditRecentChange<P>|LogRecentChange<P> )[];
	};
	continue? : {
		rccontinue? : string;
	};
}

export type ApiQueryListRecentChangesRequestResponse<T extends ApiQueryListRecentChangesRequest> =
	T['rcprop'] extends ApiQueryListRecentChangesProps ? ApiQueryListRecentChangesResponse<T['rcprop']> :
	T['rcprop'] extends readonly ApiQueryListRecentChangesProps[] ? ApiQueryListRecentChangesResponse<T['rcprop'][number]>
		: ApiQueryListRecentChangesResponse;