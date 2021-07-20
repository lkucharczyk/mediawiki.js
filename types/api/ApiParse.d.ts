import { ApiRequestBase } from './ApiRequest';
import { ApiResponse } from './ApiResponse';

export type ApiParsePropSections = {
	toclevel : number,
	level : string,
	line : string
	number : string,
	index : string;
	fromtitle : string;
	byteoffset : number;
	anchor : string;
}[];

export type ApiParseProps = 'sections'|'text';

export type ApiParseRequest = ApiRequestBase & {
	action : 'parse';
	prop? : ApiParseProps|readonly ApiParseProps[];
} & (
	{ oldid : number; page? : never }
	| { oldid? : never; page : string }
);

export interface ApiParseResponse<P extends ApiParseProps = ApiParseProps> extends ApiResponse {
	parse : {
		title : string;
		pageid : number;
		revid? : number;
	}
	& ( Extract<P, 'sections'> extends never ? {} : { sections : ApiParsePropSections } )
	& ( Extract<P, 'text'> extends never ? {} : { text : string } )
}

export type ApiParseRequestResponse<T extends ApiParseRequest> =
	T['prop'] extends ApiParseProps ? ApiParseResponse<T['prop']> :
	T['prop'] extends readonly ApiParseProps[] ? ApiParseResponse<T['prop'][number]>
		: ApiParseResponse;
