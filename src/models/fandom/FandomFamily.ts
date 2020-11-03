import { Fandom } from './Fandom';
import { FandomWiki } from './FandomWiki';
import { WikiFamily } from '../WikiFamily';

export class FandomFamily extends WikiFamily {
	public readonly network : Fandom;

	protected wikiCache : { [ url : string ] : FandomWiki };

	public constructor( base : FandomWiki, strict : boolean = true ) {
		super( base, strict );
		this.network = base.network;
		this.wikiCache = { [base.url]: base };
	}

	protected getWiki( url : string ) : FandomWiki {
		if ( !( url in this.wikiCache ) ) {
			this.wikiCache[url] = this.network.getWiki( url );
		}

		return this.wikiCache[url];
	}
};
