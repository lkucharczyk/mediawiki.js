import { UncompleteModel } from "./UncompleteModel";
import { Wiki } from "./Wiki";
import { WikiNetwork } from "./WikiNetwork";
import { WikiUserSet } from './WikiUserSet';

export class WikiUser extends UncompleteModel {
	public static readonly COMPONENTS = [ 'id', 'name', 'groups' ];

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

	protected async __load( components : string[] ) : Promise<void> {
		await new WikiUserSet( [ this ] ).load( ...components );
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
