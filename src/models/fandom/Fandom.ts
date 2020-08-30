import { FandomWiki } from './FandomWiki';
import { FetchManager, FetchManagerOptions } from '../../util/FetchManager';
import { WikiNetwork } from '../WikiNetwork';

export class Fandom extends WikiNetwork {
	public static readonly REGEXP_DOMAIN = /\.(?:fandom\.com|\wikia\.(?:com|org))$/
	public static readonly REGEXP_LANG = /^[a-z]{2}(?:-[a-z]{2,})?$/
	public static readonly REGEXP_WIKI = /^(?:([a-z]{2}(?:-[a-z]{2,})?)\.)?([a-z0-9-_]+)$/

	public constructor( fetchManager? : FetchManager|FetchManagerOptions ) {
		super( 'Fandom', fetchManager );
	}

	public getWiki( wiki : string ) : FandomWiki {
		let url;
		try {
			url = new URL( !wiki.startsWith( 'https://' ) ? `https://${wiki}` : wiki );
		} catch {}

		if ( url && Fandom.REGEXP_DOMAIN.test( url.hostname ) ) {
			let entrypoint = url.origin;

			const path = url.pathname.split( '/' );
			if ( path.length > 1 && Fandom.REGEXP_LANG.test( path[1] ) ) {
				entrypoint += `/${path[1]}`;
			}

			return new FandomWiki( this, `${entrypoint}/api.php`, this.fetchManager );
		}

		const match = wiki.match( Fandom.REGEXP_WIKI );
		if ( match ) {
			return new FandomWiki( this, `https://${match[2]}.fandom.com${match[1] ? `/${match[1]}` : ''}/api.php`, this.fetchManager );
		}

		throw new Error( 'Specified wiki is not on the Fandom network.' );
	}
};
