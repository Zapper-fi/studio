import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const CASK_PROTOCOL_DEFINITION = appDefinition({
  id: 'cask-protocol',
  name: 'Cask Protocol',
  description: 'Automation protocol for web3, including subscriptions, auto-investing and protocol top-ups.',
  url: 'https://app.cask.fi/',

  groups: {
    wallet: {
      id: 'wallet',
      type: GroupType.TOKEN,
      label: 'Cask Wallet',
    },
  },

  tags: [AppTag.PAYMENTS],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
    [Network.GNOSIS_MAINNET]: [AppAction.VIEW],
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
    [Network.CELO_MAINNET]: [AppAction.VIEW],
    [Network.AURORA_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(CASK_PROTOCOL_DEFINITION.id)
export class CaskProtocolAppDefinition extends AppDefinition {
  constructor() {
    super(CASK_PROTOCOL_DEFINITION);
  }
}
