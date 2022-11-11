import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const SUSHISWAP_KASHI_DEFINITION = appDefinition({
  id: 'sushiswap-kashi',
  name: 'SushiSwap Kashi',
  description: `Gas efficient, isolated lending market`,
  primaryColor: '#887eb3',
  url: 'https://sushi.com',
  tags: [AppTag.LENDING],

  links: {
    github: 'https://github.com/sushiswap',
    twitter: 'https://twitter.com/sushiswap',
    discord: 'https://discord.com/invite/NVPXN4e',
    medium: 'https://sushichef.medium.com/',
  },

  groups: {
    lending: {
      id: 'lending',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    leverage: {
      id: 'leverage',
      type: GroupType.POSITION,
      label: 'Leverage',
    },
  },

  supportedNetworks: {
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },

  token: {
    address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(SUSHISWAP_KASHI_DEFINITION.id)
export class SushiswapKashiAppDefinition extends AppDefinition {
  constructor() {
    super(SUSHISWAP_KASHI_DEFINITION);
  }
}
