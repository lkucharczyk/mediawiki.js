import { ApiQueryListAllusersCriteria, ApiQueryMaybeUser, ApiQueryUserBlockinfo } from '../../types/types';
import { UnprefixKeys } from '../../types/util';
import { prefixKeys } from '../util/util';
import { Loaded, UncompleteModel } from "./UncompleteModel";
import { UncompleteModelSet } from './UncompleteModelSet';
import { Wiki } from "./Wiki";
import { WikiNetwork } from "./WikiNetwork";

interface WikiUserComponents {
	blockinfo?: UnprefixKeys<UnprefixKeys<ApiQueryUserBlockinfo, 'blocked'>, 'block'>|null,
	exists?: boolean,
	id? : number;
	name? : string;
	groups? : string[];
};

interface WikiUser extends WikiUserComponents {
	load<T extends keyof WikiUserComponents>( ...components : T[] ) : Promise<Loaded<this, T>>;
	setLoaded( components : keyof WikiUserComponents|( keyof WikiUserComponents )[] ) : void;
};

class WikiUser extends UncompleteModel {
	public network? : WikiNetwork;
	public wiki : Wiki;

	public constructor( wiki : Wiki, name : number|string ) {
		super();

		this.network = wiki.network;
		this.wiki = wiki;

		if ( typeof name === 'number' ) {
			this.id = name;
			this.setLoaded( 'id' );
		} else {
			this.name = name.replace( /_/g, ' ' ).trim();
			this.name = ( this.name[0] ?? '' ).toUpperCase() + this.name.substring( 1 );
			this.setLoaded( 'name' );
		}
	}

	public async getURL( params? : Record<string, string> ) : Promise<string> {
		await this.load( 'name' );
		return this.wiki.getWikiURL( `User:${ this.name! }`, params );
	}

	public clear() : void {
		super.clear();

		if ( this.id ) {
			this.setLoaded( 'id' );
		}

		if ( this.name ) {
			this.setLoaded( 'name' );
		}
	}

	public static async fetch<W extends Wiki, U extends WikiUser>( wiki: W, criteria: ApiQueryListAllusersCriteria = {} ) : Promise<Loaded<U, 'id'|'name'>[]> {
		const users : Loaded<U, 'id'|'name'>[] = [];
		let aufrom : string|undefined;

		criteria ??= {};
		criteria.limit ??= 'max';

		do {
			const res = await wiki.callApi( {
				action: 'query',
				list: 'allusers',
				aufrom,
				...prefixKeys( criteria, 'au' )
			} );

			for ( const u of res.query.allusers ) {
				users.push( wiki.getUser( {
					id: u.userid,
					name: u.name
				} ) as Loaded<U, 'id'|'name'>);
			}

			aufrom = res.continue?.aufrom;
		} while ( typeof criteria.limit !== 'number' && aufrom );

		return users;
	}
};

interface WikiUserSet {
	load<T extends keyof WikiUserComponents>( ...components : T[] ) : Promise<this & { models: Loaded<WikiUser, T>[] }>;
};

class WikiUserSet<T extends WikiUser = WikiUser> extends UncompleteModelSet<T> {
};

const WikiUserLoader = {
	components: [ 'blockinfo', 'exists', 'id', 'name', 'groups' ],
	async load( set : WikiUser|WikiUserSet ) {
		const models = set instanceof WikiUser ? [ set ] : set.models;

		const ids : number[] = [];
		const names : string[] = [];

		for ( const model of models ) {
			if ( model.id ) {
				ids.push( model.id );
			} else if ( model.name ) {
				names.push( model.name );
			}
		}

		const users: ApiQueryMaybeUser<'blockinfo'|'groups'>[] = [];
		const promises = [];

		const params = {
			action: 'query',
			list: 'users',
			usprop: [ 'blockinfo', 'groups' ]
		} as const;

		if ( ids.length ) {
			promises.push(
				models[0].wiki.callApi(
					Object.assign( { ususerids: ids }, params )
				).then( e => users.push( ...e.query.users ) )
			);
		}

		if ( names.length ) {
			promises.push(
				models[0].wiki.callApi(
					Object.assign( { ususers: names }, params )
				).then( e => users.push( ...e.query.users ) )
			);
		}

		await Promise.all( promises );

		for ( const model of models ) {
			model.exists = false;

			for ( const user of users ) {
				if ( ( !user.invalid && user.userid !== undefined && model.id === user.userid ) || ( user.name && model.name === user.name ) ) {
					if ( !user.missing && !user.invalid ) {
						model.exists = true;
						model.id = user.userid;
						model.name = user.name;
						model.groups = user.groups;
						model.blockinfo = user.blockedby
							? {
								by: user.blockedby,
								byid: user.blockedbyid,
								expiry: user.blockexpiry,
								id: user.blockid,
								reason: user.blockreason,
								timestamp: user.blockedtimestamp
							}
							: null;
					}

					break;
				}
			}

			if ( !model.exists ) {
				model.setLoaded( WikiUser.COMPONENTS as ( keyof WikiUserComponents )[] );
			}
		}

		return this.components;
	}
};

WikiUser.registerLoader( WikiUserLoader );
WikiUserSet.registerLoader( WikiUserLoader );

export { WikiUser, WikiUserSet };
export type { WikiUserComponents };
