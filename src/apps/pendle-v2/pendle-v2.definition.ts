import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const PENDLE_V_2_DEFINITION = appDefinition({
  id: 'pendle-v2',
  name: 'Pendle',
  description:
    'Pendle is a permissionless DeFi yield-trading protocol, where users can execute various yield management strategies',
  url: 'https://www.pendle.finance/',

  groups: {
    farm: {
      id: 'farm',
      type: GroupType.TOKEN,
      label: 'Pools',
    },
  },

  tags: [AppTag.DERIVATIVES],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(PENDLE_V_2_DEFINITION.id)
export class PendleV2AppDefinition extends AppDefinition {
  constructor() {
    super(PENDLE_V_2_DEFINITION);
  }
}
