import { ApiQueryResponse } from './ApiResponse';
import { ApiQueryPage } from './ApiQueryPage';
import { ApiQueryRequest } from './ApiRequest';

export interface ApiQueryListAllpagesRequest extends ApiQueryRequest {
	list : 'allpages';
	apcontinue? : string;
	apdir? : 'ascending'|'descending';
	apfilterlanglinks? : 'all'|'withlanglinks'|'withoutlanglinks';
	apfilterredir? : 'all'|'nonredirects'|'redirects';
	apfrom? : number;
	aplimit? : number|'max';
	apmaxsize? : number;
	apminsize? : number;
	apnamespace? : number;
	apprefix? : string;
	apprexpiry? : 'all'|'definite'|'indefinite';
	apprfiltercascade? : 'all'|'cascading'|'noncascading';
	apprlevel? : string|readonly string[];
	apprtype? : string|readonly string[];
	apto? : string;
}

export interface ApiQueryListAllpagesResponse extends ApiQueryResponse {
	query : {
		allpages : ApiQueryPage[];
	};
	continue? : {
		apcontinue? : string;
	};
}
