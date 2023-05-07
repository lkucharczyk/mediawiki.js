import { NirvanaRequestBase } from '../NirvanaRequest';

export namespace NirvanaActivityApi {
	export namespace GetSocialActivity {
		type ActionType = 'create' | 'update' | 'delete';
		type ContentType = `${ 'comment' | 'message' | 'post' }${ '' | '-reply' }`;

		export interface Request extends NirvanaRequestBase {
			controller: 'ActivityApi',
			method: 'getSocialActivity',
			lastUpdateTime?: number
		}

		export type Response = {
			date: string,
			actions: {
				time: string,
				icon: string,
				label: string,
				actionType: ActionType,
				contentType: ContentType
			}[]
		}[];
	}
}
