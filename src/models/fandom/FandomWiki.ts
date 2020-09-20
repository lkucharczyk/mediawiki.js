import { Fandom } from './Fandom';
import { FandomUser } from './FandomUser';
import { FandomUserSet } from './FandomUserSet';
import { FetchManager, FetchManagerOptions } from '../../util/util';
import { MercuryWikiVariables, MercuryWikiVariablesResult, NirvanaResult } from '../../interfaces/Fandom';
import { RequestInit } from 'node-fetch';
import { Wiki } from '../Wiki';

export class FandomWiki extends Wiki {
	public static readonly COMPONENTS = [ ...Wiki.COMPONENTS, 'id' ];

	public readonly network : Fandom;

	public id? : number;

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

	public getUser( name : string|number ) : FandomUser {
		return new FandomUser( name, this );
	}

	public getUsers( names : (string|number)[] ) : FandomUserSet {
		return new FandomUserSet( names.map( e => this.getUser( e ) ) );
	}

	protected async __load( components : string[] ) : Promise<void> {
		const MWV_COMPONENTS = [ 'id', 'lang' ];
		if ( components.find( e => MWV_COMPONENTS.includes( e ) ) ) {
			const mwv = await this.getMercuryWikiVariables();
			this.id = mwv.id;
			this.lang = mwv.language.content;

			this.setLoaded( MWV_COMPONENTS );
			components = components.filter( e => !MWV_COMPONENTS.includes( e ) );
		}

		if ( components.length ) {
			super.__load( components );
		}
	}

	public clear() : void {
		this.id = undefined;
		this.lang = undefined;
		this.#mercuryWikiVariables = undefined;

		super.clear();
	}
};
