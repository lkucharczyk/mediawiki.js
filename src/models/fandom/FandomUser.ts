import { Fandom } from './Fandom';
import { FandomWiki } from './FandomWiki';
import { WikiUser, WikiUserComponents, WikiUserSet } from '../WikiUser';
import { chunkArray } from '../../util/util';
import { Loaded } from '../UncompleteModel';

interface FandomUserComponents extends WikiUserComponents {
	avatar? : string;
};

interface FandomUser extends FandomUserComponents {
	wiki : FandomWiki;
	network : Fandom;
	load<T extends keyof FandomUserComponents>( ...components : T[] ) : Promise<Loaded<this, T>>;
	setLoaded( components : keyof FandomUserComponents|( keyof FandomUserComponents )[] ) : void;
};

class FandomUser extends WikiUser {
	public constructor( name : string|number, wiki : FandomWiki ) {
		super( name, wiki );
	}
};

interface FandomUserSet {
	load<T extends keyof FandomUserComponents>( ...components : T[] ) : Promise<this & { models: Loaded<FandomUser, T>[] }>;
};

class FandomUserSet extends WikiUserSet<FandomUser> {
};

const FandomUserLoader = {
	components: [ 'avatar', 'name' ],
	dependencies: [ 'id' ],
	async load( set : FandomUser|FandomUserSet ) {
		const models = set instanceof FandomUser ? [ set ] : set.models;
		const chunks = chunkArray( models.map( e => e.id as number ), 100 );

		return Promise.all( chunks.map( ids =>
			models[0].wiki.callNirvana( {
				controller: 'UserApi',
				method: 'getDetails',
				ids
			} ).then( res => {
				for ( const user of res.items ) {
					const model = models.find( e => e.id === user.user_id );
					if ( model ) {
						model.name = user.name;
						model.avatar = user.avatar;
					}
				}
			} )
		) ).then( () => this.components );
	}
}

FandomUser.registerLoader( ...WikiUser.LOADERS, FandomUserLoader );
FandomUserSet.registerLoader( ...WikiUserSet.LOADERS, FandomUserLoader );

export { FandomUser, FandomUserComponents, FandomUserSet };
