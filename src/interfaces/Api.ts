export interface ApiError {
	code : string;
	info : string;
	'*' : string;
};

export interface ApiResult {
	error? : ApiError;
};

export interface Interwiki {
	api? : string;
	language? : string;
	local? : string|boolean;
	prefix : string;
	url : string;
};

export type ApiQuerySiteinfoProp = 'general'|'interwikimap'|'statistics';

export interface ApiQuerySiteinfoResult extends ApiResult {
	query : {
		general : {
			articlepath : string;
			base : string;
			case : 'first-letter'|'case-sensitive';
			generator : string;
			lang : string;
			mainpage : string;
			script : string;
			scriptpath : string;
			server : string;
			sitename : string;
			timezone : string;
			timeoffset : number;
			wikiid : string;
		}
	}
};

export interface ApiQueryInterwikiMapResult extends ApiResult {
	query : {
		interwikimap : Interwiki[];
	}
};

export interface ApiStatistics {
	activeusers : number;
	admins : number;
	articles : number;
	edits : number;
	images : number;
	jobs : number;
	pages : number;
	users : number;
};

export interface ApiQueryStatisticsResult extends ApiResult {
	query : {
		statistics : ApiStatistics;
	};
};

export interface ApiQueryToken extends ApiResult {
	query : {
		pages : {
			[ key : string ] : {
				edittoken : string
			}
		}
	}
};

export interface ApiUser {
	userid : number;
	name : string;
	groups : string[];
};

export interface ApiQueryListUsers extends ApiResult {
	query : {
		users : ApiUser[];
	}
};
