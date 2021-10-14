export type ApiQueryPropRevisionsProps = 'comment'|'content'|'contentmodel'|'flags'|'ids'|'parsedcomment'|'roles'|'size'|'sha1'|'slotsha1'|'slotsize'|'tags'|'timestamp'|'user'|'userid';

export interface ApiQueryPropRevisionsParams {
	rvcontinue? : string;
	rvprop? : ApiQueryPropRevisionsProps|readonly ApiQueryPropRevisionsProps[];
	rvslots? : string|readonly string[];
}

export type ApiQueryPropRevisionsSlot<P extends ApiQueryPropRevisionsProps> =
	( Extract<P, 'content'> extends never ? {} : {
		content : string;
		contentformat : string;
	} )
	& ( Extract<P, 'content'|'contentmodel'> extends never ? {} : { contentmodel : string } )
	& ( Extract<P, 'slotsha1'> extends never ? {} : { sha1 : string } )
	& ( Extract<P, 'slotsize'> extends never ? {} : { size : number } );

export interface ApiQueryPropRevisionsSlots<P extends ApiQueryPropRevisionsProps> {
	main : ApiQueryPropRevisionsSlot<P>;
	[ slot : string ] : ApiQueryPropRevisionsSlot<P>|undefined;
}

export type ApiQueryPropRevisions<P extends ApiQueryPropRevisionsProps = 'comment'|'flags'|'ids'|'timestamp'|'user'> = (
	Pick<{
		comment : string;
		parsedcomment : string;
		roles : string[];
		sha1 : string;
		size : number;
		tags : string[];
		timestamp : string;
		user : string;
		userid : number;
	}, Exclude<P,'content'|'contentmodel'|'flags'|'ids'|'slotsha1'|'slotsize'>>
	& ( Extract<P, 'flags'> extends never ? {} : { minor : boolean } )
	& ( Extract<P, 'ids'> extends never ? {} : {
		parentid : number;
		revid : number;
	} )
	& ( Extract<P, 'content'|'contentmodel'|'slotsha1'|'slotsize'> extends never ? {} : { slots : ApiQueryPropRevisionsSlots<P> } )
)[];
