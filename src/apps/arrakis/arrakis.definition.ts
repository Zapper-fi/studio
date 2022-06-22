import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ARRAKIS_DEFINITION = appDefinition({
  id: 'arrakis',
  name: 'Arrakis Finance',
  description: `Arrakis is a protocol that specializes in concentrated & active management. By creating a curated strategies.`,
  url: 'https://arrakis.finance/',

  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },
  },

  tags: [AppTag.LIQUIDITY_POOL],
  keywords: [],

  links: {
    discord: 'https://discord.gg/arrakisfinance',
    github: 'https://github.com/arrakisfinance',
    medium: 'https://medium.com/arrakis-finance',
    telegram: 'https://t.me/arrakisfinance',
    twitter: 'https://twitter.com/ArrakisFinance',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(ARRAKIS_DEFINITION.id)
export class ArrakisAppDefinition extends AppDefinition {
  constructor() {
    super(ARRAKIS_DEFINITION);
  }
}
