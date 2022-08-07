import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const OOKI_DEFINITION = appDefinition({
  id: 'ooki',
  name: 'ooki',
  description: 'ooki is a protocol for borrowing, lending, and margin trading',
  url: 'https://ooki.com/',

  groups: {
    ooki: {
      id: 'ooki',
      type: GroupType.TOKEN,
      label: 'ooki',
    },
  },

  tags: [
    AppTag.COLLATERALIZED_DEBT_POSITION,
    AppTag.DECENTRALIZED_EXCHANGE,
    AppTag.LENDING,
    AppTag.MARGIN_TRADING,
    AppTag.STAKING,
  ],

  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(OOKI_DEFINITION.id)
export class OokiAppDefinition extends AppDefinition {
  constructor() {
    super(OOKI_DEFINITION);
  }
}

export default OOKI_DEFINITION;
