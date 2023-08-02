import type { ExtractVal } from '../../util';

export interface Request {
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

export type RequestResponse<R extends Request> = Response<ExtractVal<number, R['stablePageIds']>, ExtractVal<number, R['userIds']>>;
