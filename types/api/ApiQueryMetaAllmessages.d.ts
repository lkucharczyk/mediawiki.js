import { ApiQueryRequest } from './ApiRequest';
import { ApiQueryResponse } from './ApiResponse';

export interface ApiQueryMetaAllmessagesRequest extends ApiQueryRequest {
	meta : 'allmessages';
	amargs? : string|readonly string[];
	amcustomised? : 'all'|'modified'|'unmodified';
	amenableparser? : 'true';
	amfilter? : string;
	amfrom? : string;
	amincludelocal? : 'true';
	amlang? : string;
	ammessages? : string|readonly string[];
	amprefix? : string;
	amto? : string;
}

export interface ApiQueryMetaAllmessagesResponse extends ApiQueryResponse {
	query : {
		allmessages : {
			content : string;
			name : string;
			normalizedname : string;
		}[];
	};
}
