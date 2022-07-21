import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const STARGATE_FINANCE_DEFINITION = appDefinition({
  id: 'stargate-finance',
  name: 'Stargate Finance',
  description: 'A Composable Omnichain Native Asset Bridge',
  url: 'https://stargate.finance/',

  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Pool',
    },

    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Farm',
    },

    ve: {
      id: 've',
      type: GroupType.TOKEN,
      label: 'VotedEscrow',
    },
  },

  tags: [AppTag.CROSS_CHAIN],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(STARGATE_FINANCE_DEFINITION.id)
export class StargateFinanceAppDefinition extends AppDefinition {
  constructor() {
    super(STARGATE_FINANCE_DEFINITION);
  }
}

export default STARGATE_FINANCE_DEFINITION;
