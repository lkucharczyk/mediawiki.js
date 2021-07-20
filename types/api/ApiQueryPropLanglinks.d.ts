export type ApiQueryPropLanglinksProps = 'autonym'|'langname'|'url';

export type ApiQueryPropLanglinks<P extends ApiQueryPropLanglinksProps = never> = (
	{
		lang : string;
		title : string;
	}
	& ( Extract<P, 'autonym'> extends never ? {} : { autonym : string } )
	& ( Extract<P, 'langname'> extends never ? {} : { langname : string } )
	& ( Extract<P, 'url'> extends never ? {} : { url : string } )
)[];
