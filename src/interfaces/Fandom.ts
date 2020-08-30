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
	data : MercuryWikiVariables
};
