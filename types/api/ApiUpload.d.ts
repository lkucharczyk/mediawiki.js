import { ApiRequestBase } from './ApiRequest';

export interface ApiUploadRequest extends ApiRequestBase {
	action : 'upload';
	async? : 'true';
	checkstatus? : 'true';
	comment? : string;
	filename? : string;
	ignorewarnings? : 'true';
	text? : string;
	token : string;
	url : string;
	watchlist? : 'nochange'|'preferences'|'watch';
}
