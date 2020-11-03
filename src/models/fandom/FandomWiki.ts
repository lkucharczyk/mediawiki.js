import { Fandom } from './Fandom';
import { FandomUser, FandomUserSet } from './FandomUser';
import { chunkArray, FetchManager, FetchManagerOptions } from '../../util/util';
import { MercuryWikiVariables, MercuryWikiVariablesResult, NirvanaResult, WikiDetails } from '../../interfaces/Fandom';
import { RequestInit } from 'node-fetch';
import { UncompleteModelLoader } from '../UncompleteModel';
import { UncompleteModelSet } from '../UncompleteModelSet';
import { Wiki } from '../Wiki';
import { FandomFamily } from './FandomFamily';

interface FandomWiki {
	registerLoader( ...loader : UncompleteModelLoader<FandomWiki>[] ) : void;
};

class FandomWiki extends Wiki {
	public readonly network : Fandom;
	public family? : FandomFamily;

	public founder? : FandomUser;
	public foundingdate? : string;
	public id? : number;
	public vertical? : string;

	#mercuryWikiVariables? : MercuryWikiVariables;

	constructor( network : Fandom, entrypoint : string, fetchManager? : FetchManager|FetchManagerOptions, requestOptions? : RequestInit ) {
		super( entrypoint, fetchManager, requestOptions );
		this.network = network;
	}

	public async callNirvana<T extends NirvanaResult = NirvanaResult>( params : Record<string, string> & { controller : string, method? : string }, options? : RequestInit ) : Promise<T> {
		params.format = 'json';
		return ( await this.call( 'wikia.php', params, options ) ).json();
	}

	public async getMercuryWikiVariables() : Promise<MercuryWikiVariables> {
		if ( !this.#mercuryWikiVariables ) {
			this.#mercuryWikiVariables = ( await this.callNirvana<MercuryWikiVariablesResult>( {
				controller: 'MercuryApiController',
				method: 'getWikiVariables'
			} ) ).data;
		}

		return this.#mercuryWikiVariables;
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
		this.#mercuryWikiVariables = undefined;

		super.clear();
	}

	public toJSON() : any {
		const out : any = super.toJSON();

		if ( this.founder && this.founder.id ) {
			out.founder = this.founder.id
		}

		return out;
	}
};

class FandomWikiSet extends UncompleteModelSet<FandomWiki> {
};

export { FandomWiki, FandomWikiSet };

// MercuryWikiVariables loader
const FandomWikiMWVLoader = {
	components: [ 'articlepath', 'id', 'lang', 'name', 'scriptpath', 'server', 'vertical' ],
	async load( wiki : FandomWiki ) {
		const mwv = await wiki.getMercuryWikiVariables();

		wiki.articlepath = mwv.articlePath + '$1';
		wiki.id = mwv.id;
		wiki.lang = mwv.language.content;
		wiki.name = mwv.siteName;
		wiki.server = mwv.basePath;
		wiki.scriptpath = mwv.scriptPath;
		wiki.vertical = mwv.vertical;

		wiki.setLoaded( this.components );
	}
};

// WikiDetails loader
const FandomWikiWDLoader = {
	components: [ 'founder', 'foundingdate', 'lang', 'name', 'server', 'vertical' ],
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
						const founderID = Number.parseInt( details.founding_user_id );
						if ( founderID > 0 ) {
							wiki.founder = wiki.getUser( founderID );
						}

						wiki.foundingdate = details.creation_date;
						wiki.lang = details.lang;
						wiki.name = details.name;
						wiki.server = `https://${ details.domain }`;
						wiki.vertical = details.hub;
					}
				}
			}
		} );
	}
};

FandomWiki.registerLoader( ...Wiki.LOADERS, FandomWikiMWVLoader, FandomWikiWDLoader );
FandomWikiSet.registerLoader( FandomWikiWDLoader );
