import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppTag, AppAction } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const SUSHISWAP_DEFINITION = appDefinition({
  id: 'sushiswap',
  name: 'Sushiswap',
  description: `Sushi is a community-driven DeFi platform Take advantage of your crypto assets with Sushi's powerful DeFi tools!`,
  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Pools',
      groupLabel: 'Pools',
    },
    chefV1Farm: {
      id: 'chef-v1-farm',
      type: GroupType.POSITION,
      label: 'Farms',
      groupLabel: 'Farms',
    },
    chefV2Farm: {
      id: 'chef-v2-farm',
      type: GroupType.POSITION,
      label: 'Farms',
      groupLabel: 'Farms',
    },
  },
  url: 'https://sushi.com',
  links: {
    github: 'https://github.com/sushiswap',
    twitter: 'https://twitter.com/sushiswap',
    discord: 'https://discord.com/invite/NVPXN4e',
    medium: 'https://sushichef.medium.com/',
  },
  tags: [AppTag.LIQUIDITY_POOL],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.GNOSIS_MAINNET]: [AppAction.VIEW],
    [Network.CELO_MAINNET]: [AppAction.VIEW],
  },
  primaryColor: '#887eb3',
  token: {
    address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(SUSHISWAP_DEFINITION.id)
export class SushiswapAppDefinition extends AppDefinition {
  constructor() {
    super(SUSHISWAP_DEFINITION);
  }
}
