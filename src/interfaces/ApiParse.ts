import { ApiResult } from './Api';

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

export interface ApiParse<P extends ApiParseProps = ApiParseProps> extends ApiResult {
	parse : {
		title : string;
		pageid : number;
		revid? : number;
	}
	& ( P extends 'sections' ? { sections : ApiParsePropSections } : {} )
	& ( P extends 'text' ? { text : string } : {} )
};
