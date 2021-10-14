export type ApiQueryPropImageinfoProps = 'bitdepth'|'canonicaltitle'|'comment'|'commonmetadata'|'mediatype'|'metadata'|'mime'|'parsedcomment'|'sha1'|'size'|'timestamp'|'url'|'user'|'userid';

export interface ApiQueryPropImageinfoParams {
	iicontinue? : string;
	iiprop? : ApiQueryPropImageinfoProps|readonly ApiQueryPropImageinfoProps[];
	iilimit? : number|'max';
}

interface Metadata {
	name : string;
	value : any;
}

export type ApiQueryPropImageinfo<P extends ApiQueryPropImageinfoProps = 'timestamp'|'user'> = {
	imagerepository? : 'local'|'shared';
	imageinfo?: (
		Pick<{
			bitdepth : number;
			canonicaltitle : string;
			comment : string;
			commonmetadata : Metadata[];
			mediatype : string;
			metadata : Metadata[];
			mime : string;
			parsedcomment : string;
			sha1 : string;
			timestamp : string;
			user : string;
			userid : number;
		}, Exclude<P, 'size'|'url'>>
		& ( Extract<P, 'size'> extends never ? {} : {
			height : number;
			size : number;
			width : number;
		} )
		& ( Extract<P, 'url'> extends never ? {} : {
			descriptionshorturl : string;
			descriptionurl : string;
			url : string;
		} )
	)[];
};
