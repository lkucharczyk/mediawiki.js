import { Fandom } from './Fandom';
import { FandomWiki } from './FandomWiki';
import { WikiUser, WikiUserComponents, WikiUserSet } from '../WikiUser';
import { chunkArray } from '../../util/util';
import { Wiki } from '../Wiki';
import type { Loaded } from '../UncompleteModel';
import type { ApiQueryListAllusersCriteria } from '../../../types/types';

type FandomUserAttribute = 'bio'|'discordHandle'|'fbPage'|'name'|'twitter'|'website';
interface FandomUserComponents extends WikiUserComponents {
	attributes?: Partial<Record<FandomUserAttribute, string>>,
	avatar?: string
};

interface FandomUser extends FandomUserComponents {
	wiki : FandomWiki;
	network : Fandom;
	load<T extends keyof FandomUserComponents>( ...components : T[] ) : Promise<Loaded<this, T>>;
	setLoaded( components : keyof FandomUserComponents|( keyof FandomUserComponents )[] ) : void;
};

class FandomUser extends WikiUser {
	public constructor( wiki : FandomWiki, name : string|number ) {
		super( wiki, name );
	}

	public static fetch( wiki: Wiki, criteria?: ApiQueryListAllusersCriteria ): never;
	public static fetch( wiki: FandomWiki, criteria?: ApiQueryListAllusersCriteria ): Promise<Loaded<FandomUser, 'id'|'name'>[]>;
	public static async fetch( wiki: FandomWiki, criteria: ApiQueryListAllusersCriteria = {} ) {
		return WikiUser.fetch<FandomWiki, FandomUser>( wiki, criteria );
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
};

FandomUser.registerLoader( ...WikiUser.LOADERS, FandomUserLoader );
FandomUserSet.registerLoader( ...WikiUserSet.LOADERS, FandomUserLoader );

FandomUser.registerLoader( {
	components: [ 'attributes', 'avatar', 'name' ],
	dependencies: [ 'id' ],
	async load( model: Loaded<FandomUser, 'id'> ) {
		model.attributes = {};
		if ( model.exists === false || !model.id ) {
			return;
		}

		const res = await model.network.callServices( '/user-attribute/user/' + model.id ) as {
			_embedded: {
				properties: {
					name: string,
					value: string
				}[]
			}
		};

		const match: FandomUserAttribute[] = [ 'bio', 'discordHandle', 'fbPage', 'name', 'twitter', 'website' ];
		const check = match.includes.bind( match ) as ( v: any ) => v is FandomUserAttribute;

		for ( const { name, value } of res._embedded.properties ) {
			if ( !value ) {
				continue;
			}

			if ( check( name ) ) {
				model.attributes[name] = value;
			} else if ( name === 'avatar' ) {
				model.avatar = value;
			} else if ( name === 'username' ) {
				model.name = value;
			}
		}
	}
} );

export { FandomUser, FandomUserSet };
export type { FandomUserComponents };
