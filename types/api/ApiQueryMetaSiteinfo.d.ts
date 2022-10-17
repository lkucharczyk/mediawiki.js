import { ApiQueryResponse } from './ApiResponse';
import { ApiQueryRequest } from './ApiRequest';

export namespace ApiQueryMetaSiteinfo {
	export interface PropGeneral {
		articlepath: string,
		base: string,
		case: 'first-letter'|'case-sensitive',
		generator: string,
		lang: string,
		mainpage: string,
		script: string,
		scriptpath: string,
		server: string,
		sitename: string,
		timezone: string,
		timeoffset: number,
		wikiid: string
	}

	export type PropInterwikimap = {
		api?: string,
		language?: string,
		local?: string|boolean,
		prefix: string,
		url: string
	}[];

	export type PropNamespaces = Record<string, {
		canonical?: string,
		case: 'first-letter'|'case-sensitive',
		content: boolean,
		defaultcontentmodel?: string,
		id: number,
		name: string,
		namespaceprotection?: string,
		nonincludable: boolean,
		subpages: boolean
	}>;

	export interface PropStatistics {
		activeusers: number,
		admins: number,
		articles: number,
		edits: number,
		images: number,
		jobs: number,
		pages: number,
		users: number
	}

	export type Props = 'general'|'interwikimap'|'namespaces'|'statistics';

	export interface Request extends ApiQueryRequest {
		meta: 'siteinfo',
		siprop?: Props|readonly Props[]
	}

	export interface Response<P extends Props = 'general'> extends ApiQueryResponse {
		query: Pick<{
			general: PropGeneral,
			interwikimap: PropInterwikimap,
			namespaces: PropNamespaces,
			statistics: PropStatistics
		}, P>
	}

	export type RequestResponse<T extends Request> =
		T['siprop'] extends Props
			? Response<T['siprop']>
			: T['siprop'] extends readonly Props[]
				? Response<T['siprop'][number]>
				: Response;
}
