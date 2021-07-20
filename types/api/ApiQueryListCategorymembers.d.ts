import { ApiQueryResponse } from './ApiResponse';

export type ApiQueryListCategorymembersProps = 'ids'|'sortkey'|'sortkeyprefix'|'timestamp'|'title'|'type';

export interface ApiQueryListCategorymembersResponse<P extends ApiQueryListCategorymembersProps = 'ids'|'title'> extends ApiQueryResponse {
	query : {
		categorymembers : (
			( Extract<P, 'ids'> extends never ? {} : { pageid : number } )
			& ( Extract<P, 'sortkey'> extends never ? {} : { sortkey : string } )
			& ( Extract<P, 'sortkeyprefix'> extends never ? {} : { sortkeyprefix : string } )
			& ( Extract<P, 'timestamp'> extends never ? {} : { timestamp : string } )
			& ( Extract<P, 'title'> extends never ? {} : {
				ns : number;
				title : string;
			} )
			& ( Extract<P, 'type'> extends never ? {} : { type : 'file'|'page'|'subcat' } )
		)[];
	};
	continue? : {
		cmcontinue? : string;
	}
}
