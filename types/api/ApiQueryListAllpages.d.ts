import { ApiQueryResponse } from './ApiResponse';
import { ApiQueryPage } from './ApiQueryPage';
import { ApiQueryRequest } from './ApiRequest';
import { PrefixKeys } from '../util';

export namespace ApiQueryListAllpages {
	export interface Criteria {
		dir?: 'ascending'|'descending',
		filterredir?: 'all'|'nonredirects'|'redirects',
		filterlanglinks?: 'all'|'withlanglinks'|'withoutlanglinks',
		from?: string,
		limit?: number|'max',
		maxsize?: number,
		minsize?: number,
		namespace?: number,
		prexpiry?: 'all'|'definite'|'indefinite',
		prefix?: string,
		prfiltercascade?: 'all'|'cascading'|'noncascading',
		prlevel?: string|readonly string[],
		prtype?: string|readonly string[],
		to?: string
	}

	export interface Request extends ApiQueryRequest, PrefixKeys<Criteria, 'ap'> {
		list: 'allpages',
		apcontinue?: string|undefined
	}

	export interface Response extends ApiQueryResponse {
		query: {
			allpages: ApiQueryPage[]
		},
		continue?: {
			apcontinue?: string
		}
	}
}
