import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const TRISOLARIS_DEFINITION = appDefinition({
  id: 'trisolaris',
  name: 'Trisolaris',
  description:
    "Trisolaris is the most popular decentralized exchange (DEX) on NEAR's Aurora engine. Swap, pool, and farm at less than a fraction of the cost of Ethereum",
  url: 'https://www.trisolaris.io',

  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },

    farm: {
      id: 'farm',
      type: GroupType.TOKEN,
      label: 'Farms',
    },
  },

  tags: [AppTag.LIQUIDITY_POOL],
  keywords: [],
  links: {
    discord: 'https://discord.com/invite/my6GtSTmmX',
    github: 'https://github.com/trisolaris-labs',
    telegram: 'https://t.me/TrisolarisLabs',
    twitter: 'https://twitter.com/trisolarislabs',
  },

  supportedNetworks: {
    [Network.AURORA_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(TRISOLARIS_DEFINITION.id)
export class TrisolarisAppDefinition extends AppDefinition {
  constructor() {
    super(TRISOLARIS_DEFINITION);
  }
}

export default TRISOLARIS_DEFINITION;
