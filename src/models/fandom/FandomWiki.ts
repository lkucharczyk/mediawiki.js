import { Fandom } from './Fandom';
import { FandomUser, FandomUserSet } from './FandomUser';
import { chunkArray, FetchManager, FetchManagerOptions } from '../../util/util';
import { MercuryWikiVariables, MercuryWikiVariablesResult, NirvanaResult } from '../../interfaces/Fandom';
import { RequestInit } from 'node-fetch';
import { UncompleteModelSet } from '../UncompleteModelSet';
import { Wiki, WikiComponents } from '../Wiki';
import { FandomFamily } from './FandomFamily';
import { Loaded } from '../UncompleteModel';

interface FandomWikiComponents extends WikiComponents {
	id? : number;
	vertical? : string;
};

interface FandomWiki extends FandomWikiComponents {
	load<T extends keyof FandomWikiComponents>( ...components : T[] ) : Promise<Loaded<this, T>>;
};

class FandomWiki extends Wiki {
	public readonly network : Fandom;
	public family? : FandomFamily;

	constructor( network : Fandom, entrypoint : string, fetchManager? : FetchManager|FetchManagerOptions, requestOptions? : RequestInit ) {
		super( entrypoint, fetchManager, requestOptions );
		this.network = network;
	}

	public async callNirvana<T extends NirvanaResult = NirvanaResult>( params : Record<string, string> & { controller : string, method? : string }, options? : RequestInit ) : Promise<T> {
		params.format = 'json';
		return this.call( 'wikia.php', params, options ).then( e => e.json() );
	}

	public async getMercuryWikiVariables() : Promise<MercuryWikiVariables> {
		return this.callNirvana<MercuryWikiVariablesResult>( {
			controller: 'MercuryApiController',
			method: 'getWikiVariables'
		} ).then( e => e.data );
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

interface FandomWikiSet {
	load<T extends keyof FandomWikiComponents>( ...components : T[] ) : Promise<this & { models: Loaded<FandomWiki, T>[] }>;
};

class FandomWikiSet extends UncompleteModelSet<FandomWiki> {
};

// MercuryWikiVariables loader
const FandomWikiMWVLoader = {
	components: [ 'articlepath', 'id', 'lang', 'name', 'scriptpath', 'server', 'vertical' ],
	async load( wiki : FandomWiki ) {
		return wiki.getMercuryWikiVariables().then( mwv => {
			wiki.articlepath = mwv.articlePath + '$1';
			wiki.id = mwv.id;
			wiki.lang = mwv.language.content;
			wiki.name = mwv.siteName;
			wiki.server = mwv.basePath;
			wiki.scriptpath = mwv.scriptPath;
			wiki.vertical = mwv.vertical;

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
		const ids = chunkArray( models.map( e => e.id ).filter( e => e !== undefined ) as number[], 250 );

		return Promise.all( ids.map( e => models[0].network.getWikiDetails( e ) ) ).then( res => {
			for ( const result of res ) {
				for ( const _id in result ) {
					const id = Number.parseInt( _id );
					const details = result[_id];

					const wiki = models.find( e => e.id === id );
					if ( wiki ) {
						wiki.lang = details.lang;
						wiki.name = details.name;
						wiki.server = details.url;
					}
				}
			}

			return this.components;
		} );
	}
};

FandomWiki.registerLoader( ...Wiki.LOADERS, FandomWikiMWVLoader, FandomWikiWDLoader );
FandomWikiSet.registerLoader( FandomWikiWDLoader );

export { FandomWiki, FandomWikiComponents, FandomWikiSet };
