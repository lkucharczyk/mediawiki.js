import { OnlyOneOf } from '../util';
import { ApiRequestBase } from './ApiRequest';
import { ApiResponse } from './ApiResponse';

declare namespace ApiEdit {
	export type Request = ApiRequestBase & {
		action: 'edit',
		appendtext?: string,
		basetimestamp?: string|Date,
		bot?: 'true',
		contentformat?: string,
		contentmodel?: string,
		creeateonly?: 'true',
		md5?: string,
		minor?: 'true',
		nocreate?: 'true',
		notminor?: 'true',
		prependtext?: string,
		recreate?: 'true',
		redirect?: 'true',
		section?: number|'new',
		sectiontitle?: string,
		starttimestamp?: string|Date,
		summary?: string,
		tags?: string|readonly string[],
		text?: string,
		token: string,
		undo?: number,
		undoafter?: number,
		watchlist?: 'nochange'|'preferences'|'unwatch'|'watch'
	} & OnlyOneOf<{
		pageid: number,
		title: string
	}>;

	type ResponseSuccess = {
		result: 'Success'
		pageid: number,
		title: string,
		contentmodel: string,
		new?: boolean
	} & ( {
		nochange: true
	} | {
		nochange?: undefined
		oldrevid: number,
		newrevid: number,
		newtimestamp: string
	} )

	interface ResponseFailure {
		result: 'Failure'
	}

	export interface Response extends ApiResponse {
		edit: ResponseSuccess | ResponseFailure
	}
}
