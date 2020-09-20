import { Fandom } from './Fandom';
import { FandomUserSet } from './FandomUserSet';
import { FandomWiki } from './FandomWiki';
import { WikiUser } from '../WikiUser';

interface FandomUser extends WikiUser {
	wiki : FandomWiki;
	network : Fandom;
};

class FandomUser extends WikiUser {
	public constructor( name : string|number, wiki : FandomWiki ) {
		super( name, wiki );
	}

	protected async __load( components : string[] ) : Promise<void> {
		await new FandomUserSet( [ this ] ).load( ...components );
	}
};

export { FandomUser };
