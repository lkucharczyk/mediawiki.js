import { Fandom } from './Fandom';
import { FandomWiki } from './FandomWiki';
import { WikiUser, WikiUserSet } from '../WikiUser';
import { chunkArray } from '../../util/util';

interface FandomUser extends WikiUser {
	wiki : FandomWiki;
	network : Fandom;
};

class FandomUser extends WikiUser {
	avatar? : string;

	public constructor( name : string|number, wiki : FandomWiki ) {
		super( name, wiki );
	}

	protected async __load( components : string[] ) : Promise<void> {
		await new FandomUserSet( [ this ] ).load( ...components );
	}
};

class FandomUserSet extends WikiUserSet<FandomUser> {
};

const FandomUserLoader = {
	components: [ 'avatar', 'name' ],
	dependencies: [ 'id' ],
	async load( set : FandomUser|FandomUserSet ) {
		const models = set instanceof FandomUser ? [ set ] : set.models;
		const chunks = chunkArray( models.map( e => e.id as number ), 100 );

		return Promise.all( chunks.map( e => models[0].network.getUserDetails( e ) ) ).then( res => {
			for ( const result of res ) {
				for ( const user of result ) {
					const model = models.find( e => e.id === user.user_id );
					if ( model ) {
						model.name = user.name;
						model.avatar = user.avatar;
					}
				}
			}
		} );
	}
}

FandomUser.registerLoader( ...WikiUser.LOADERS, FandomUserLoader );
FandomUserSet.registerLoader( ...WikiUserSet.LOADERS, FandomUserLoader );

export { FandomUser, FandomUserSet };
