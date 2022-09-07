import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const PODS_YIELD_DEFINITION = appDefinition({
  id: 'pods-yield',
  name: 'Pods Yield',
  description:
    'Change the way you earn. Tap into low-risk protected vaults to make more with less overhead. Starting with ETH and options.',
  url: 'https://app.yield.pods.finance',

  groups: {
    strategy: {
      id: 'strategy',
      type: GroupType.TOKEN,
      label: 'Strategies',
    },

    queue: {
      id: 'queue',
      type: GroupType.POSITION,
      label: 'Queues',
    },
  },

  tags: [AppTag.ASSET_MANAGEMENT],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#C41857',
});

@Register.AppDefinition(PODS_YIELD_DEFINITION.id)
export class PodsYieldAppDefinition extends AppDefinition {
  constructor() {
    super(PODS_YIELD_DEFINITION);
  }
}

export default PODS_YIELD_DEFINITION;
