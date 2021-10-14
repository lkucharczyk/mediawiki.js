export interface ApiQueryPropTemplatesParams {
	tlcontinue? : string;
	tldir? : 'ascending'|'descending'
	tllimit? : number|'max';
	tlnamespace? : '*'|number|readonly number[];
	tltemplates? : string|readonly string[];
}

export type ApiQueryPropTemplates = {
	ns : number;
	title : string;
}[];
