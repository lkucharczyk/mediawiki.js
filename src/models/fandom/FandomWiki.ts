import { Fandom } from './Fandom';
import { FandomUser, FandomUserSet } from './FandomUser';
import { chunkArray, FetchManager, FetchManagerOptions } from '../../util/util';
import { RequestInit } from 'node-fetch';
import { UncompleteModelSet } from '../UncompleteModelSet';
import { Wiki, WikiComponents } from '../Wiki';
import { FandomFamily } from './FandomFamily';
import { Loaded } from '../UncompleteModel';
import {
	ApiQueryMetaSiteinfoPropGeneral,
	KnownNirvanaRequests,
	KnownNirvanaResponses,
	NirvanaErrorResponse,
	NirvanaRequestBase,
	NirvanaResponse
} from '../../../types/types';
import { NirvanaError } from './NirvanaError';

interface FandomWikiComponents extends WikiComponents {
	id? : number;
	vertical? : string;
};

interface FandomWiki extends FandomWikiComponents {
	siteinfo? : ApiQueryMetaSiteinfoPropGeneral & { gamepedia? : 'true'|'false' };
	callNirvana<P extends KnownNirvanaRequests>( params : Readonly<P>, options? : RequestInit ) : Promise<KnownNirvanaResponses<P>>;
	load<T extends keyof FandomWikiComponents>( ...components : T[] ) : Promise<Loaded<this, T>>;
	setLoaded( components : keyof FandomWikiComponents|( keyof FandomWikiComponents )[] ) : void;
};

class FandomWiki extends Wiki {
	public readonly network : Fandom;
	public family? : FandomFamily;

	constructor( network : Fandom, entrypoint : string, fetchManager? : FetchManager|FetchManagerOptions, requestOptions? : RequestInit ) {
		super( entrypoint, fetchManager, requestOptions );
		this.network = network;
	}

	public async callNirvanaUnknown<T extends NirvanaResponse = NirvanaResponse>( params : NirvanaRequestBase, options? : RequestInit ) : Promise<T> {
		params.format = 'json';
		return this.call( 'wikia.php', this.processApiParams( params, ',' ), options )
			.then( r => r.json() as Promise<T|NirvanaErrorResponse> )
			.then( r => {
				if ( 'error' in r && r.error !== undefined ) {
					throw new NirvanaError( r );
				}

				return r;
			} );
	}

	public getFamily( strict : boolean = true ) : FandomFamily {
		if ( !this.family ) {
			this.family = new FandomFamily( this, strict );
		}

		return this.family;
	}

	public getUser( name : string|number ) : FandomUser {
		return new FandomUser( name, this );
	}

	public getUsers( names : (string|number)[] ) : FandomUserSet {
		return new FandomUserSet( names.map( e => this.getUser( e ) ) );
	}

	public clear() : void {
		this.id = undefined;
		this.lang = undefined;

		super.clear();
	}
};

FandomWiki.prototype.callNirvana = FandomWiki.prototype.callNirvanaUnknown;

interface FandomWikiSet {
	load<T extends keyof FandomWikiComponents>( ...components : T[] ) : Promise<this & { models: Loaded<FandomWiki, T>[] }>;
};

class FandomWikiSet extends UncompleteModelSet<FandomWiki> {
};

// MercuryWikiVariables loader
const FandomWikiMWVLoader = {
	components: [ 'articlepath', 'id', 'lang', 'name', 'scriptpath', 'server', 'vertical' ],
	async load( wiki : FandomWiki ) {
		return wiki.callNirvana( {
			controller: 'MercuryApi',
			method: 'getWikiVariables'
		} ).then( res => {
			wiki.articlepath = res.data.articlePath + '$1';
			wiki.id = res.data.id;
			wiki.lang = res.data.language.content;
			wiki.name = res.data.siteName;
			wiki.server = res.data.basePath;
			wiki.scriptpath = res.data.scriptPath;
			wiki.vertical = res.data.vertical;

			return this.components;
		} );
	}
};

// WikiDetails loader
const FandomWikiWDLoader = {
	components: [ 'lang', 'name', 'server' ],
	dependencies: [ 'id' ],
	async load( set : FandomWiki|FandomWikiSet ) {
		const models = set instanceof FandomWiki ? [ set ] : set.models;
		const chunks = chunkArray( models.map( e => e.id ).filter( e => e !== undefined ) as number[], 250 );

		return Promise.all( chunks.map( ids =>
			models[0].callNirvana( {
				controller: 'WikisApi',
				method: 'getDetails',
				ids
			} ).then( result => {
				for ( const _id in result.items ) {
					const id = Number.parseInt( _id );
					const details = result.items[id];

					const wiki = models.find( e => e.id === id );
					if ( wiki && details ) {
						wiki.lang = details.lang;
						wiki.name = details.name;
						wiki.server = details.url;
					}
				}
			} )
		) ).then( () => this.components );
	}
};

FandomWiki.registerLoader( ...Wiki.LOADERS, FandomWikiMWVLoader, FandomWikiWDLoader );
FandomWikiSet.registerLoader( FandomWikiWDLoader );

export { FandomWiki, FandomWikiComponents, FandomWikiSet };
