import { ApiQueryUser } from '../../types/types';
import { Loaded, UncompleteModel } from "./UncompleteModel";
import { UncompleteModelSet } from './UncompleteModelSet';
import { Wiki } from "./Wiki";
import { WikiNetwork } from "./WikiNetwork";

interface WikiUserComponents{
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

	public constructor( name : number|string, wiki : Wiki ) {
		super();

		this.network = wiki.network;
		this.wiki = wiki;

		if ( typeof name === 'number' ) {
			this.id = name;
			this.setLoaded( 'id' );
		} else {
			this.name = name.replace( /_/g, ' ' ).trim();
			this.setLoaded( 'name' );
		}
	}

	public async getURL( params? : Record<string, string> ) : Promise<string> {
		await this.load( 'name' );
		return this.wiki.getWikiURL( `User:${ this.name }`, params );
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
};

interface WikiUserSet {
	load<T extends keyof WikiUserComponents>( ...components : T[] ) : Promise<this & { models: Loaded<WikiUser, T>[] }>;
};

class WikiUserSet<T extends WikiUser = WikiUser> extends UncompleteModelSet<T> {
};

const WikiUserLoader = {
	components: [ 'id', 'name', 'groups' ],
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

		const users : ApiQueryUser<'groups'>[] = [];
		const promises = [];

		const params = {
			action: 'query',
			list: 'users',
			usprop: 'groups'
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

		for ( const user of users ) {
			for ( const model of models ) {
				if ( model.id === user.userid || model.name === user.name ) {
					model.id = user.userid;
					model.name = user.name;
					model.groups = user.groups;
				}
			}
		}

		return this.components;
	}
};

WikiUser.registerLoader( WikiUserLoader );
WikiUserSet.registerLoader( WikiUserLoader );

export { WikiUser, WikiUserComponents, WikiUserSet };
