import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const KYBERSWAP_ELASTIC_DEFINITION = appDefinition({
  id: 'kyberswap-elastic',
  name: 'KyberSwap Elastic',
  description:
    'KyberSwap’s newest protocol, dubbed KyberSwap Elastic, is a tick-based AMM with concentrated liquidity.',
  url: 'https://kyberswap.com',

  groups: {
    liquidity: {
      id: 'liquidity',
      type: GroupType.POSITION,
      label: 'Pools',
    },
  },

  tags: [AppTag.LIQUIDITY_POOL],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
    [Network.CRONOS_MAINNET]: [AppAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(KYBERSWAP_ELASTIC_DEFINITION.id)
export class KyberSwapElasticAppDefinition extends AppDefinition {
  constructor() {
    super(KYBERSWAP_ELASTIC_DEFINITION);
  }
}

export default KYBERSWAP_ELASTIC_DEFINITION;
