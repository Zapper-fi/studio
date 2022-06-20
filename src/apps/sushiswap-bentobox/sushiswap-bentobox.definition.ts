import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const SUSHISWAP_BENTOBOX_DEFINITION = appDefinition({
  id: 'sushiswap-bentobox',
  name: 'SushiSwap BentoBox',
  description: `BentoBox is a token vault that generates yield for the capital deposited into it`,
  groups: {
    vault: { id: 'vault', type: GroupType.POSITION, label: 'SushiSwap BentoBox', groupLabel: 'Farms' },
  },
  url: 'https://sushi.com',
  tags: [AppTag.YIELD_AGGREGATOR],
  links: {
    github: 'https://github.com/sushiswap',
    twitter: 'https://twitter.com/sushiswap',
    discord: 'https://discord.com/invite/NVPXN4e',
    medium: 'https://sushichef.medium.com/',
  },
  supportedNetworks: {
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },
  primaryColor: '#887eb3',
  token: {
    address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(SUSHISWAP_BENTOBOX_DEFINITION.id)
export class SushiSwapBentoBoxAppDefinition extends AppDefinition {
  constructor() {
    super(SUSHISWAP_BENTOBOX_DEFINITION);
  }
}
