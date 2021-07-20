import { OnlyOneOf } from '../util';
import { ApiRequestBase } from './ApiRequest';

export type ApiEditRequest = ApiRequestBase & {
	action : 'edit';
	appendtext? : string;
	basetimestamp? : string|Date;
	bot? : 'true';
	contentformat? : string;
	contentmodel? : string;
	creeateonly? : 'true';
	md5? : string;
	minor? : 'true';
	nocreate? : 'true';
	notminor? : 'true';
	prependtext? : string;
	recreate? : 'true';
	redirect? : 'true';
	section? : number;
	sectiontitle? : string;
	starttimestamp? : string|Date;
	summary? : string;
	tags? : string|readonly string[];
	text? : string;
	token : string;
	undo? : number;
	undoafter? : number;
	watchlist? : 'nochange'|'preferences'|'unwatch'|'watch';
} & OnlyOneOf<{
	pageid : number;
	title : string;
}>;
