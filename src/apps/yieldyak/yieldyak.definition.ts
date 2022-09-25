import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const YIELDYAK_DEFINITION = appDefinition({
  id: 'yieldyak',
  name: 'yieldyak',
  description:
    'Yield Yak provides tools for DeFi users on Avalanche. Discover a huge selection of autocompounding farms and make your life easier.',
  url: 'https://yieldyak.com/',

  groups: {
    farms: {
      id: 'farms',
      type: GroupType.TOKEN,
      label: 'farm',
    },
  },

  tags: [AppTag.FARMING, AppTag.YIELD_AGGREGATOR],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(YIELDYAK_DEFINITION.id)
export class YieldyakAppDefinition extends AppDefinition {
  constructor() {
    super(YIELDYAK_DEFINITION);
  }
}

export default YIELDYAK_DEFINITION;
