import { Response } from 'node-fetch';
import { ApiQueryListAllpagesCriteria } from '../main';
import { prefixKeys } from '../util/util';
import { Loaded, UncompleteModel } from './UncompleteModel';
import { Wiki } from './Wiki';

interface WikiPageComponents {
	exists?: boolean;
	id?: number;
	ns?: number;
	title?: string;
}

interface WikiPage extends WikiPageComponents {
	load<T extends keyof WikiPageComponents>( ...components : T[] ) : Promise<Loaded<this, T>>;
}

class WikiPage extends UncompleteModel {
	public readonly wiki: Wiki;

	constructor( wiki: Wiki, title: string|number ) {
		super();

		this.wiki = wiki;

		if ( typeof title === 'string' ) {
			this.title = title;
			this.setLoaded( 'title' );
		} else {
			this.id = title;
			this.setLoaded( 'id' );
		}
	}

	public clear(): void {
		super.clear();

		if ( this.id ) {
			this.setLoaded( 'id' );
		}

		if ( this.title ) {
			this.setLoaded( 'title' );
		}
	}

	public async export( history: boolean = true, templates: boolean = false ): Promise<Response> {
		await this.load( 'title' );

		return this.wiki.callIndex( Object.assign(
			{
				title: 'Special:Export',
				pages: this.title!
			},
			( history ? {} : { curonly: '1' } ) as ( {} | { curonly: '1' } ),
			( templates ? { templates: '1' } : {} ) as ( {} | { templates: '1' } )
		), history ? { method: 'POST' } : {} );
	}

	public static async fetch( wiki: Wiki, criteria: ApiQueryListAllpagesCriteria = {} ): Promise<Loaded<WikiPage, 'exists'|'id'|'ns'|'title'>[]> {
		const pages : Loaded<WikiPage, 'exists'|'id'|'ns'|'title'>[] = [];
		let apcontinue : string|undefined;

		criteria ??= {};
		criteria.limit ??= 'max';

		do {
			const res = await wiki.callApi( {
				action: 'query',
				list: 'allpages',
				apcontinue,
				...prefixKeys( criteria, 'ap' )
			} );

			for ( const page of res.query.allpages ) {
				pages.push( wiki.getPage( {
					exists: true,
					id: page.pageid,
					ns: page.ns,
					title: page.title
				} ) );
			}

			apcontinue = res.continue?.apcontinue;
		} while ( typeof criteria.limit !== 'number' && apcontinue );

		return pages;
	}
}

WikiPage.registerLoader( {
	components: [ 'exists', 'id', 'ns', 'title' ],
	async load( model: Loaded<WikiPage, 'id'>|Loaded<WikiPage, 'title'> ) {
		const res = await ( model.isLoaded( 'id' )
			? model.wiki.callApi( { action: 'query', pageids: model.id! } )
			: model.wiki.callApi( { action: 'query', titles: model.title! } ) );

		const page = res.query?.pages?.[0];
		model.exists = !!page && page.missing !== true;

		if ( page ) {
			model.ns = page.ns;

			if ( model.exists ) {
				model.id = page.pageid;
				model.title = page.title;
			}
		}

		if ( !model.exists ) {
			model.setLoaded( WikiPage.COMPONENTS as ( keyof WikiPageComponents )[] );
		}
	}
} );

export { WikiPage };
export type { WikiPageComponents };
