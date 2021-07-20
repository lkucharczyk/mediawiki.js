import { ApiQueryUser } from '../../types/types';
import { UncompleteModel } from "./UncompleteModel";
import { UncompleteModelSet } from './UncompleteModelSet';
import { Wiki } from "./Wiki";
import { WikiNetwork } from "./WikiNetwork";

export class WikiUser extends UncompleteModel {
	public id? : number;
	public name : string = '';
	public network? : WikiNetwork;
	public wiki : Wiki;

	public groups : string[] = [];

	public constructor( name : number|string, wiki : Wiki ) {
		super();

		this.network = wiki.network;
		this.wiki = wiki;

		if ( typeof name === 'number' ) {
			this.id = name;
			this.setLoaded( 'id' );
		} else {
			this.name = name;
			this.setLoaded( 'name' );
		}
	}

	public async getURL( params? : Record<string, string> ) : Promise<string> {
		await this.load( 'name' );
		return this.wiki.getWikiURL( `User:${ this.name }`, params );
	}

	public clear() : void {
		this.groups = [];

		super.clear();

		if ( this.id ) {
			this.setLoaded( 'id' );
		}

		if ( this.name ) {
			this.setLoaded( 'name' );
		}
	}
};

export class WikiUserSet<T extends WikiUser = WikiUser> extends UncompleteModelSet<T> {
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
			} else {
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
	}
};

WikiUser.registerLoader( WikiUserLoader );
WikiUserSet.registerLoader( WikiUserLoader );
