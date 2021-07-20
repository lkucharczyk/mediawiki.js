import { ApiQueryRequest } from './ApiRequest';
import { ApiQueryResponse } from './ApiResponse';

export interface ApiQueryListQuerypageRequest extends ApiQueryRequest {
	list : 'querypage';
	qppage : string;
	qplimit? : number|'max';
	qpoffset? : number;
}

export interface ApiQueryListQuerypageResponse extends ApiQueryResponse {
	query : {
		querypage : {
			name : string;
			results : {
				value : string;
				ns : number;
				title : string;
			}[];
		};
	};
	continue? : {
		qpoffset? : number;
	};
}
