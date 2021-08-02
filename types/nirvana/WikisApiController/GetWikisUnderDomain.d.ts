import { NirvanaRequestBase } from '../NirvanaRequest';
import { NirvanaResponse } from '../NirvanaResponse';

export interface NirvanaWikisApiGetWikisUnderDomainRequest extends NirvanaRequestBase {
	controller : 'WikisApi';
	method : 'getWikisUnderDomain';
	domain : string;
}

export interface NirvanaWikisApiGetWikisUnderDomainResponse extends NirvanaResponse {
	primaryDomain : string;
	wikis : {
		city_dbname : string;
		city_id : string;
		city_lang : string;
		city_title : string;
		city_url : string;
	}[];
}
