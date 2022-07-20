import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const RUBICON_DEFINITION = appDefinition({
  id: 'rubicon',
  name: 'rubicon',
  description: 'Rubicon is the order book exchange standard of Ethereum',
  url: 'https://app.rubicon.finance',

  // https://studio.zapper.fi/docs/tutorial/update-app-definition#what-are-groups
  groups: {
    bathToken: {
      id: 'bathToken',
      type: GroupType.TOKEN,
      label: 'Bath Tokens',
    },
  },

  tags: [
    AppTag.CROSS_CHAIN,
    AppTag.DECENTRALIZED_EXCHANGE,
    AppTag.INFRASTRUCTURE,
    AppTag.LIQUIDITY_POOL,
    AppTag.LIQUID_STAKING,
  ],

  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(RUBICON_DEFINITION.id)
export class RubiconAppDefinition extends AppDefinition {
  constructor() {
    super(RUBICON_DEFINITION);
  }
}

export default RUBICON_DEFINITION;
