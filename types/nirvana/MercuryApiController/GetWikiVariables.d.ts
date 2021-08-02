import { NirvanaRequestBase } from '../NirvanaRequest';
import { NirvanaResponse } from '../NirvanaResponse';

export interface NirvanaMercuryWikiVariables {
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
}

export interface NirvanaMercuryApiGetWikiVariablesRequest extends NirvanaRequestBase {
	controller : 'MercuryApi';
	method : 'getWikiVariables';
}

export interface NirvanaMercuryApiGetWikiVariablesResponse extends NirvanaResponse {
	data : NirvanaMercuryWikiVariables;
}
