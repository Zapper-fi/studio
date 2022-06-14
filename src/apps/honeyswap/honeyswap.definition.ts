import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const HONEYSWAP_DEFINITION = appDefinition({
  id: 'honeyswap',
  name: 'honeyswap',
  description:
    'Honeyswap is a decentralized exchange built on the Gnosis Chain this enables users to experience fast and secure transactions with incredibly low fees.',
  url: 'https://honeyswap.org/',

  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },
  },

  tags: [AppTag.LIQUIDITY_POOL, AppTag.LIQUID_STAKING],
  keywords: [],

  links: {
    github: 'https://github.com/1Hive',
    twitter: 'https://twitter.com/honeyswap',
    telegram: 'https://t.me/honeyswapDEX',
    discord: 'https://discord.com/invite/ruPtTTabDu',
    medium: 'https://medium.com/1hive',
  },

  supportedNetworks: {
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.GNOSIS_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(HONEYSWAP_DEFINITION.id)
export class HoneyswapAppDefinition extends AppDefinition {
  constructor() {
    super(HONEYSWAP_DEFINITION);
  }
}

export default HONEYSWAP_DEFINITION;
