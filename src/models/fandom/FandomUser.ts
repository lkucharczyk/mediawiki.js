import { Fandom } from './Fandom';
import { FandomWiki } from './FandomWiki';
import { WikiUser, WikiUserSet } from '../WikiUser';

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

		const res = await models[0].network.getUserDetails( models.map( e => e.id ) as number[] );
		for ( const user of res ) {
			for ( const model of models ) {
				if ( model.id === user.user_id || model.name === user.name ) {
					model.name = user.name;
					model.avatar = user.avatar;
				}
			}
		}
	}
}

FandomUser.registerLoader( ...WikiUser.LOADERS, FandomUserLoader );
FandomUserSet.registerLoader( ...WikiUserSet.LOADERS, FandomUserLoader );

export { FandomUser, FandomUserSet };
