import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const DEFIEDGE_DEFINITION = appDefinition({
  id: 'defiedge',
  name: 'Defiedge',
  description: 'Permissionless Liquidity Management on Uniswap V3',
  url: 'https://app.defiedge.io/',
  groups: {
    strategy: {
      id: 'strategy',
      type: GroupType.TOKEN,
      label: 'Strategies',
    },
  },

  tags: [
    AppTag.ASSET_MANAGEMENT,
    AppTag.FUND_MANAGER,
    AppTag.LIQUIDITY_POOL,
    AppTag.LIQUID_STAKING,
    AppTag.LIMIT_ORDER,
  ],

  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#3f1df0',
});

@Register.AppDefinition(DEFIEDGE_DEFINITION.id)
export class DefiedgeAppDefinition extends AppDefinition {
  constructor() {
    super(DEFIEDGE_DEFINITION);
  }
}

export default DEFIEDGE_DEFINITION;
