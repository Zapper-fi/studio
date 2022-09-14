import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ORIGIN_DOLLAR_DEFINITION = appDefinition({
  id: 'origin-dollar',
  name: 'Origin Dollar',
  description: 'Origin Dollar is the first stablecoin that earns yield while sitting in your wallet',
  url: 'https://www.ousd.com/',

  groups: {
    veogv: {
      id: 'veogv',
      type: GroupType.TOKEN,
      label: 'veOGV',
    },

    rewards: {
      id: 'rewards',
      type: GroupType.POSITION,
      label: 'OGV Rewards',
    },

    wousd: {
      id: 'wousd',
      type: GroupType.TOKEN,
      label: 'wOUSD',
    },
  },

  tags: [AppTag.ELASTIC_FINANCE, AppTag.FARMING, AppTag.STABLECOIN, AppTag.STAKING, AppTag.YIELD_AGGREGATOR],

  keywords: [],
  links: {
    discord: 'https://t.me/originprotocol',
    github: 'https://github.com/OriginProtocol',
    telegram: 'https://t.me/originprotocol',
    twitter: 'https://twitter.com/originprotocol',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(ORIGIN_DOLLAR_DEFINITION.id)
export class OriginDollarAppDefinition extends AppDefinition {
  constructor() {
    super(ORIGIN_DOLLAR_DEFINITION);
  }
}

export default ORIGIN_DOLLAR_DEFINITION;
