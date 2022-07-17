import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const STEAK_HUT_DEFINITION = appDefinition({
  id: 'steak-hut',
  name: 'SteakHut',
  description:
    'SteakHut Finance is the next generation of yield-boosting protocols on Avalanche. SteakHut is powered by Trader Joe and their veTokenomics model. In essence, SteakHut is a yield optimization protocol that synergistically integrates with veJOE farming.',
  url: 'https://www.steakhut.finance/',

  groups: {
    staking: {
      id: 'staking',
      type: GroupType.TOKEN,
      label: 'Staking',
    },

    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },
  },

  tags: [AppTag.FARMING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(STEAK_HUT_DEFINITION.id)
export class SteakHutAppDefinition extends AppDefinition {
  constructor() {
    super(STEAK_HUT_DEFINITION);
  }
}

export default STEAK_HUT_DEFINITION;
