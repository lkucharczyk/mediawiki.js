import type { NirvanaRequestBase } from '../NirvanaRequest';
import type { ExtractVal2 } from '../../util';

export interface Request extends NirvanaRequestBase {
	controller: 'FeedsAndPosts',
	method: 'getArticleNamesAndUsernames',
	stablePageIds?: number | readonly number[],
	userIds?: number | readonly number[]
}

export interface Response<A extends number = number, U extends number = number> {
	articleNames: {
		[id in A]?: {
			title: string,
			relativeUrl: string
		}
	},
	userIds: {
		[id in U]?: {
			username: string,
			relativeUrl: string
		}
	}
}

export type RequestResponse<R extends Request> = Response<ExtractVal2<number, R['stablePageIds']>, ExtractVal2<number, R['userIds']>>;
