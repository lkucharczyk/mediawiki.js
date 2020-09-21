import { ApiQueryListUsers, ApiUser } from '../main';
import { UncompleteModelSet } from './UncompleteModelSet';
import { WikiUser } from './WikiUser';

export class WikiUserSet<T extends WikiUser = WikiUser> extends UncompleteModelSet<T> {
	protected async __load( components : string[] ) {
		const LU_COMPONENTS = [ 'id', 'name', 'groups' ];
		if ( components.find( e => LU_COMPONENTS.includes( e ) ) ) {
			const ids : number[] = [];
			const names : string[] = [];

			for ( const model of this.models ) {
				if ( model.id ) {
					ids.push( model.id );
				} else {
					names.push( model.name );
				}
			}

			const users : ApiUser[] = [];
			const promises = [];

			const params = {
				action: 'query',
				list: 'users',
				usprop: 'groups'
			};

			if ( ids.length ) {
				promises.push(
					this.models[0].wiki.callApi<ApiQueryListUsers>(
						Object.assign( {
							usids: ids.join( '|' ),
							ususerids: ids.join( '|' )
						}, params )
					).then( e => users.push( ...e.query.users ) )
				);
			}

			if ( names.length ) {
				promises.push(
					this.models[0].wiki.callApi<ApiQueryListUsers>(
						Object.assign( { ususers: names.join( '|' ) }, params )
					).then( e => users.push( ...e.query.users ) )
				);
			}

			await Promise.all( promises );

			for ( const user of users ) {
				for ( const model of this.models ) {
					if ( model.id === user.userid || model.name === user.name ) {
						model.id = user.userid;
						model.name = user.name;
						model.groups = user.groups;
					}

					this.setLoaded( LU_COMPONENTS );
				}
			}

			components = components.filter( e => !LU_COMPONENTS.includes( e ) );
		}

		return super.__load( components );
	}
};
