import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const GMX_DEFINITION = appDefinition({
  id: 'gmx',
  name: 'GMX',
  description: 'Trade BTC, ETH, AVAX and other top cryptocurrencies with up to 30x leverage directly from your wallet.',
  url: 'https://gmx.io/',

  groups: {
    esGmx: {
      id: 'es-gmx',
      type: GroupType.TOKEN,
      label: 'esGMX',
      groupLabel: 'Escrow',
      isHiddenFromExplore: true,
    },

    glp: {
      id: 'glp',
      type: GroupType.TOKEN,
      label: 'GLP',
      groupLabel: 'Liquidity',
    },

    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Farms',
      groupLabel: 'Farms',
    },
  },
  tags: [AppTag.MARGIN_TRADING],
  keywords: [],
  links: {
    github: 'https://github.com/gmx-io',
    twitter: 'https://twitter.com/GMX_IO',
    discord: 'https://discord.com/invite/cxjZYR4gQK',
    medium: 'https://medium.com/@gmx.io',
    telegram: 'https://t.me/GMX_IO',
  },

  supportedNetworks: {
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#2d42fc',
  token: {
    address: '0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a',
    network: Network.ARBITRUM_MAINNET,
  },
});

@Register.AppDefinition(GMX_DEFINITION.id)
export class GmxAppDefinition extends AppDefinition {
  constructor() {
    super(GMX_DEFINITION);
  }
}

export default GMX_DEFINITION;
