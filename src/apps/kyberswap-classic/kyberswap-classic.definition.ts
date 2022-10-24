import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const KYBERSWAP_CLASSIC_DEFINITION = appDefinition({
  id: 'kyberswap-classic',
  name: 'KyberSwap Classic',
  description: `KyberSwap Classic is a next-generation AMM designed to maximize the use of capital by enabling extremely high capital efficiency and reacting to market conditions to optimise returns for liquidity providers.`,
  url: 'https://classic.exchange/',
  tags: [AppTag.LIQUIDITY_POOL],
  links: {},

  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Pools',
      groupLabel: 'Pools',
    },

    legacyFarm: {
      id: 'legacy-farm',
      type: GroupType.POSITION,
      label: 'Farms',
      groupLabel: 'Farms',
    },

    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Farms',
      groupLabel: 'Farms',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
    [Network.CRONOS_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(KYBERSWAP_CLASSIC_DEFINITION.id)
export class KyberSwapClassicAppDefinition extends AppDefinition {
  constructor() {
    super(KYBERSWAP_CLASSIC_DEFINITION);
  }
}
