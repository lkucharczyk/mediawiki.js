import { ApiQueryListRecentChangesShow, RecentChange } from './ApiQueryListRecentchanges';
import { ApiQueryRequest } from './ApiRequest';
import { ApiQueryResponse } from './ApiResponse';
import { OnlyOneOf } from '../util';

export namespace ApiQueryListUsercontribs {
	export type Props = 'comment'|'flags'|'ids'|'parsedcomment'|'patrolled'|'size'|'sizediff'|'tags'|'timestamp'|'title';

	export type Request = ApiQueryRequest & {
		list: 'usercontribs',
		uccontinue?: string,
		ucdir?: 'newer'|'older',
		ucend?: Date|string,
		uclimit?: number|'max',
		ucnamespace?: readonly number[]|number,
		ucprop?: readonly Props[]|Props,
		ucstart?: Date|string,
		ucshow?: ApiQueryListRecentChangesShow,
		uctag?: string
	} & OnlyOneOf<{
		ucuser: readonly string[]|string,
		ucuserids: readonly number[]|number,
		ucuserprefix: string
	}>;

	export interface Response<P extends Props> extends ApiQueryResponse {
		query: {
			usercontribs: Omit<RecentChange<Exclude<P|'user'|'userid', 'size'|'sizediff'>>, 'type'>[]
		},
		continue?: {
			uccontinue?: string
		}
	}

	export type RequestResponse<T extends Request> =
		T['ucprop'] extends Props ? Response<T['ucprop']> :
		T['ucprop'] extends readonly Props[] ? Response<T['ucprop'][number]>
			: Response<'comment'|'ids'|'flags'|'timestamp'|'title'|'size'>;
}
