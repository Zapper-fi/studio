import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const SADDLE_DEFINITION = appDefinition({
  id: 'saddle',
  name: 'Saddle',
  description: `Saddle is an automated market maker optimized for trading between pegged value crypto assets.`,
  url: 'https://saddle.finance/',
  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },

    miniChefV2: {
      id: 'mini-chef-v2',
      type: GroupType.POSITION,
      label: 'Farms',
    },

    communalFarm: {
      id: 'communal-farm',
      type: GroupType.POSITION,
      label: 'Farms',
    },
  },
  tags: [AppTag.LIQUIDITY_POOL],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.EVMOS_MAINNET]:    [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(SADDLE_DEFINITION.id)
export class SaddleAppDefinition extends AppDefinition {
  constructor() {
    super(SADDLE_DEFINITION);
  }
}

export default SADDLE_DEFINITION;
