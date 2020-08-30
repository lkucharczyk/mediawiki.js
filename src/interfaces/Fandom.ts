export interface NirvanaError {
	exception : {
		type : string;
		message : string;
		code : number;
		details : string;
	}
};

export interface NirvanaResult {
	exception? : NirvanaError
	trace_id? : string;
};

export interface MercuryWikiVariables {
	vertical : string;
	appleTouchIcon : {
		url : string;
		size : string;
	}
	articlePath : string;
	basePath : string;
	dbName : string;
	favicon : string;
	id : number;
	isClosed : boolean;
	htmlTitle : {
		separator : string;
		parts : string[];
	};
	language : {
		content : string;
		contentDir : string;
	};
	scriptPath : string;
	siteName : string;
	mainPageTitle : string;
};

export interface MercuryWikiVariablesResult extends NirvanaResult {
	data : MercuryWikiVariables;
};

export interface UserDetails {
	user_id : number;
	title : string;
	name : string;
	url : string;
	numberofedits : number;
	avatar : string;
};

export interface UserDetailsResult extends NirvanaResult {
	basepath : string;
	items : UserDetails[];
};

export interface WikiDetails {
	id : number;
	wordmark : string;
	title : string;
	stats : {
		edits : number;
		articles : number;
		pages : number;
		users : number;
		activeUsers : number;
		images : number;
		videos : number;
		admins : number;
		discussions? : number;
	},
	topUsers : number[];
	founding_user_id : string;
	creation_date : string;
	headline : string|null;
	name : string;
	domain : string;
	hub : string;
	lang : string;
	topic : string|null;
	desc : string;
	image : string;
};

export interface WikiDetailsResult extends NirvanaResult {
	items : {
		[ id : number ] : WikiDetails;
	};
};
