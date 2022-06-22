import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ACROSS_V2_DEFINITION = appDefinition({
  id: 'across-v2',
  name: 'Across-V2',
  description: 'Across is the fastest, cheapest and most secure cross-chain bridge.',
  url: 'https://across.to',

  groups: {
    pool: {
      id: 'pool',
      type: GroupType.POSITION,
      label: 'Pool',
    },
  },

  tags: [AppTag.BRIDGE, AppTag.CROSS_CHAIN],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
    // [Network.BOAB_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(ACROSS_V2_DEFINITION.id)
export class AcrossV2AppDefinition extends AppDefinition {
  constructor() {
    super(ACROSS_V2_DEFINITION);
  }
}

export default ACROSS_V2_DEFINITION;
