import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const LLAMAPAY_DEFINITION = appDefinition({
  id: 'llamapay',
  name: 'Llamapay',
  description: 'LlamaPay integration for Zapper',
  url: 'https://llamapay.io/',

  groups: {
    stream: {
      id: 'stream',
      type: GroupType.POSITION,
      label: 'Stream',
    },
  },

  tags: [AppTag.PAYMENTS],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#23BD8F',
});

@Register.AppDefinition(LLAMAPAY_DEFINITION.id)
export class LlamapayAppDefinition extends AppDefinition {
  constructor() {
    super(LLAMAPAY_DEFINITION);
  }
}

export default LLAMAPAY_DEFINITION;
