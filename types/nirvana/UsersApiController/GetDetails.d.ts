import { NirvanaRequestBase } from '../NirvanaRequest';
import { NirvanaResponse } from '../NirvanaResponse';

export interface NirvanaUserDetails {
	user_id : number;
	title : string;
	name : string;
	url : string;
	numberofedits : number;
	avatar : string;
}

export interface NirvanaUserApiGetDetailsRequest extends NirvanaRequestBase {
	controller : 'UserApi';
	method : 'getDetails';
	ids : number|readonly number[];
	size? : number;
}

export interface NirvanaUserApiGetDetailsResponse extends NirvanaResponse {
	basepath : string;
	items : NirvanaUserDetails[];
}
