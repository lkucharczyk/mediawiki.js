import { ApiQueryResponse } from './ApiResponse';
import { ApiQueryRequest, ApiRequestBase } from './ApiRequest';

interface ApiQueryMetaSiteinfoPropGeneral {
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

type ApiQueryMetaSiteinfoPropInterwikimap = {
	api? : string;
	language? : string;
	local? : string|boolean;
	prefix : string;
	url : string;
}[];

interface ApiQueryMetaSiteinfoPropStatistics {
	activeusers : number;
	admins : number;
	articles : number;
	edits : number;
	images : number;
	jobs : number;
	pages : number;
	users : number;
}

export type ApiQueryMetaSiteinfoProps = 'general'|'interwikimap'|'statistics';

export interface ApiQueryMetaSiteinfoRequest extends ApiQueryRequest {
	meta : 'siteinfo';
	siprop? : ApiQueryMetaSiteinfoProps|readonly ApiQueryMetaSiteinfoProps[];
}

export interface ApiQueryMetaSiteinfoResponse<P extends ApiQueryMetaSiteinfoProps = 'general'> extends ApiQueryResponse {
	query : Pick<{
		general : ApiQueryMetaSiteinfoPropGeneral;
		interwikimap : ApiQueryMetaSiteinfoPropInterwikimap;
		statistics : ApiQueryMetaSiteinfoPropStatistics;
	}, P>;
}

export type ApiQueryMetaSiteinfoRequestResponse<T extends ApiQueryMetaSiteinfoRequest> =
	T['siprop'] extends ApiQueryMetaSiteinfoProps ? ApiQueryMetaSiteinfoResponse<T['siprop']> :
	T['siprop'] extends readonly ApiQueryMetaSiteinfoProps[] ? ApiQueryMetaSiteinfoResponse<T['siprop'][number]>
		: ApiQueryMetaSiteinfoResponse;