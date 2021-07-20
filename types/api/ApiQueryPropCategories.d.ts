export type ApiQueryPropCategoriesProps = 'hidden'|'sortkey'|'timestamp';

export type ApiQueryPropCategories<P extends ApiQueryPropCategoriesProps = never> = (
	{
		ns : 14;
		title : string;
	}
	& ( Extract<P, 'hidden'> extends never ? {} : { hidden : boolean } )
	& ( Extract<P, 'sortkey'> extends never ? {} : {
		sortkey : string;
		sortkeyprefix : string;
	} )
	& ( Extract<P, 'timestamp'> extends never ? {} : { timestamp : string } )
)[];
