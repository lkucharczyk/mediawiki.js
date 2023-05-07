import { ApiRequestBase } from './ApiRequest';
import { ApiResponse } from './ApiResponse';

export namespace ApiUserrights {
	export interface Request extends ApiRequestBase {
		action: 'userrights',
		user: string,
		add?: string | readonly string[],
		expiry?: string,
		reason?: string,
		remove?: string | readonly string[],
		token: string,
		tags?: string | readonly string[]
	}

	export interface Response extends ApiResponse {
		userrights: {
			user: string,
			userid: number,
			added?: string[],
			removed?: string[]
		}
	}
}
