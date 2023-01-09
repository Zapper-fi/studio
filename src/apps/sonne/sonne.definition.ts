import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types';

export const SONNE_DEFINITION = appDefinition({
  id: 'sonne',
  name: 'Sonne',
  description: `Sonne Finance is a decentralized lending protocol for individuals, institutions and protocols to access financial services.`,
  url: 'https://sonne.finance/',

  groups: {
    borrow: {
      id: 'borrow',
      type: GroupType.POSITION,
      label: 'Lending',
    },

    supply: {
      id: 'supply',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    sAvax: {
      id: 's-sonne',
      type: GroupType.TOKEN,
      label: 'sSonne',
    },
  },

  tags: [AppTag.LENDING],
  links: {
    discord: 'https://discord.com/invite/sonnefinance',
    github: 'https://github.com/sonne-finance',
    telegram: 'https://t.me/SonneFin',
    twitter: 'https://twitter.com/SonneFinance',
  },

  supportedNetworks: {
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(SONNE_DEFINITION.id)
export class SonneAppDefinition extends AppDefinition {
  constructor() {
    super(SONNE_DEFINITION);
  }
}
