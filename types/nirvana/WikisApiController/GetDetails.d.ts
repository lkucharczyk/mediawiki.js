import { NirvanaRequestBase } from '../NirvanaRequest';
import { NirvanaResponse } from '../NirvanaResponse';

export interface NirvanaWikiDetails {
	id : number;
	name : string;
	url : string;
	lang : string;
	desc : string;
	stats : {
		edits : string;
		articles : string;
		discussions? : number;
	},
	image : string|null;
}

export interface NirvanaWikisApiGetDetailsRequest extends NirvanaRequestBase {
	controller : 'WikisApi';
	method : 'getDetails';
	ids : number|readonly number[];
}

export interface NirvanaWikisApiGetDetailsResponse<T extends number = number> extends NirvanaResponse {
	items : {
		[ id in T ]? : NirvanaWikiDetails;
	}
}

export type NirvanaWikisApiGetDetailsRequestResponse<T extends NirvanaWikisApiGetDetailsRequest> =
	T['ids'] extends readonly number[] ? NirvanaWikisApiGetDetailsResponse<T['ids'][number]> :
	T['ids'] extends number ? NirvanaWikisApiGetDetailsResponse<T['ids']>
		: NirvanaWikisApiGetDetailsResponse;
