import { ApiQueryResponse } from './ApiResponse';
import { ApiQueryPropCategories, ApiQueryPropCategoriesProps } from './ApiQueryPropCategories';
import { ApiQueryPropCategoryInfo } from './ApiQueryPropCategoryinfo';
import { ApiQueryPropImageinfo, ApiQueryPropImageinfoProps } from './ApiQueryPropImageinfo';
import { ApiQueryPropLanglinks, ApiQueryPropLanglinksProps } from './ApiQueryPropLanglinks';
import { ApiQueryPropRevisions, ApiQueryPropRevisionsProps } from './ApiQueryPropRevisions';
import { ApiQueryRequest } from './ApiRequest';
import { OnlyOneOf } from '../util';

export interface ApiQueryPageProps {
	categories? : ApiQueryPropCategoriesProps|true;
	categoryinfo? : true;
	imageinfo? : ApiQueryPropImageinfoProps|true;
	langlinks? : ApiQueryPropLanglinksProps|true;
	revisions? : ApiQueryPropRevisionsProps|true;
}

export interface ApiQueryPagePropsKeys {
	categories : 'clprop';
	categoryinfo : never;
	imageinfo : 'iiprop';
	langlinks : 'llprop';
	revisions : 'rvprop';
}

export interface ApiQueryMissingPage {
	ns : number;
	title : string;
	missing : true;
}

export type ApiQueryPage<P extends ApiQueryPageProps = {}, M extends boolean = false> = {
	pageid : number;
	ns : number;
	title : string;
	/** It's undefined if exists; false is just for typescript type-hinting */
	missing : M extends false ? boolean : false;
}
	& Pick<{
		categories? : P['categories'] extends string ? ApiQueryPropCategories<P['categories']> : ApiQueryPropCategories;
		categoryinfo? : ApiQueryPropCategoryInfo;
		langlinks? : P['langlinks'] extends string ? ApiQueryPropLanglinks<P['langlinks']> : ApiQueryPropLanglinks;
		revisions? : P['revisions'] extends string ? ApiQueryPropRevisions<P['revisions']> : ApiQueryPropRevisions;
	}, Exclude<Extract<keyof P, keyof ApiQueryPageProps>, 'imageinfo'>>
	& ( P extends { imageinfo : string } ? ApiQueryPropImageinfo<P['imageinfo']> : {} )
	& ( P extends { imageinfo : true } ? ApiQueryPropImageinfo : {} )

type PagePropType<K extends keyof ApiQueryPageProps> = ApiQueryPageProps[K]|readonly (ApiQueryPageProps[K])[];

export type ApiQueryPageRequest = ApiQueryRequest & {
	prop? : keyof ApiQueryPageProps|readonly ( keyof ApiQueryPageProps )[];
	limit? : number|'max';

	clprop? : PagePropType<'categories'>;

	iicontinue? : string;
	iiprop? : PagePropType<'imageinfo'>;
	iilimit? : number|'max';

	llprop? : PagePropType<'langlinks'>;

	rvcontinue? : string;
	rvprop? : PagePropType<'revisions'>;
	rvslots? : string|readonly string[];
} & OnlyOneOf<{
	generator : string;
	titles : string|readonly string[];
	pageids : number|readonly number[];
	revids : number|readonly number[];
}>;

export interface ApiQueryPageResponse<P extends ApiQueryPageProps = {}, M extends boolean = false> extends ApiQueryResponse {
	query : {
		pages : ( M extends true ? ApiQueryMissingPage|ApiQueryPage<P> : ApiQueryPage<P, M> )[];
	};
	continue? : Record<string, string|undefined>
		& ( P extends { categories : string } ? { clcontinue? : string } : {} )
		& ( P extends { imageinfo : string } ? { iicontinue? : string } : {} )
		& ( P extends { langlinks : string } ? { llcontinue? : string } : {} )
		& ( P extends { revisions : string } ? { rvcontinue? : string } : {} );
}

type ExtractProp<T extends ApiQueryPageRequest, K extends keyof ApiQueryPageProps> =
	ApiQueryPagePropsKeys[K] extends never ? true :
	T[ApiQueryPagePropsKeys[K]] extends Exclude<ApiQueryPageProps[K], true> ? T[ApiQueryPagePropsKeys[K]] :
	T[ApiQueryPagePropsKeys[K]] extends readonly Exclude<ApiQueryPageProps[K], true>[] ? T[ApiQueryPagePropsKeys[K]][number]
		: true;

type ExtractProps<T extends ApiQueryPageRequest, K extends (keyof ApiQueryPageProps)[]> = K extends K ? {
	[ k in keyof Required<ApiQueryPageProps> as Extract<K[number], k> extends never ? never : k ] : ExtractProp<T, k>
} : never;

export type ApiQueryPageRequestResponse<T extends ApiQueryPageRequest> =
	T['prop'] extends keyof ApiQueryPageProps ? ApiQueryPageResponse<{ [ k in T['prop'] ] : ExtractProp<T, k> }, T extends { generator : string } ? false : true> :
	T['prop'] extends readonly ( keyof ApiQueryPageProps )[] ? ApiQueryPageResponse<ExtractProps<T, T['prop'][number][]>, T extends { generator : string } ? false : true>
		: ApiQueryPageResponse;
