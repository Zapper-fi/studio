import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const KYBERSWAP_DMM_DEFINITION = appDefinition({
  id: 'kyberswap-dmm',
  name: 'KyberSwap DMM',
  description: `KyberSwap DMM is a next-generation AMM designed to maximize the use of capital by enabling extremely high capital efficiency and reacting to market conditions to optimise returns for liquidity providers.`,
  url: 'https://dmm.exchange/',
  tags: [AppTag.LIQUIDITY_POOL],
  links: {},

  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'KyberSwap DMM',
      groupLabel: 'Pools',
    },

    legacyFarm: {
      id: 'legacy-farm',
      type: GroupType.POSITION,
      label: 'KyberSwap DMM',
      groupLabel: 'Farms',
    },

    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'KyberSwap DMM',
      groupLabel: 'Farms',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(KYBERSWAP_DMM_DEFINITION.id)
export class KyberSwapDmmAppDefinition extends AppDefinition {
  constructor() {
    super(KYBERSWAP_DMM_DEFINITION);
  }
}
