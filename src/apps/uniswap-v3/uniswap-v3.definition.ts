import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppTag, GroupType, AppAction } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const UNISWAP_V3_DEFINITION = appDefinition({
  id: 'uniswap-v3',
  name: 'Uniswap V3',
  description: `A protocol for trading and automated liquidity provision on Ethereum.`,
  url: 'https://uniswap.org/',
  primaryColor: '#f80076',
  tags: [AppTag.LIQUIDITY_POOL],
  links: {},

  groups: {
    liquidity: {
      id: 'liquidity',
      type: GroupType.POSITION,
      label: 'Liquidity Positions',
      groupLabel: 'Pools',
    },
  },

  supportedNetworks: {
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },

  token: {
    address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(UNISWAP_V3_DEFINITION.id)
export class UniswapV3AppDefinition extends AppDefinition {
  constructor() {
    super(UNISWAP_V3_DEFINITION);
  }
}
