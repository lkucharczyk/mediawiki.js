import { NirvanaRequestBase } from '../NirvanaRequest';
import { NirvanaResponse } from '../NirvanaResponse';

export interface NirvanaUserApiGetUsersByNameRequest extends NirvanaRequestBase {
	controller: 'UserApi',
	method: 'getUsersByName',
	query: string,
	limit?: number
}

export interface NirvanaUserApiGetUsersByNameResponse extends NirvanaResponse {
	users: {
		id: number,
		name: string,
		avatarUrl: string
	}[]
}
