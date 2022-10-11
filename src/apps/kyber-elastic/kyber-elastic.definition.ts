import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const KYBER_ELASTIC_DEFINITION = appDefinition({
  id: 'kyber-elastic',
  name: 'Kyber Elastic',
  description: 'KyberSwap’s newest protocol, dubbed KyberSwap Elastic, is a tick-based AMM with concentrated liquidity.',
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
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(KYBER_ELASTIC_DEFINITION.id)
export class KyberElasticAppDefinition extends AppDefinition {
  constructor() {
    super(KYBER_ELASTIC_DEFINITION);
  }
}

export default KYBER_ELASTIC_DEFINITION;
