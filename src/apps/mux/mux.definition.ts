import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const MUX_DEFINITION = appDefinition({
  id: 'mux',
  name: 'MUX',
  description:
    'Trade crypto on the MUX protocol with zero price impact, up to 100x leverage and no counterparty risks.',
  url: 'https://mux.network/',
  groups: {
    mlp: {
      id: 'mlp',
      type: GroupType.TOKEN,
      label: 'MUXLP',
    },
    mux: {
      id: 'mux',
      type: GroupType.TOKEN,
      label: 'MUX',
      isHiddenFromExplore: true,
    },
    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Farms',
    },
  },
  tags: [AppTag.MARGIN_TRADING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(MUX_DEFINITION.id)
export class MuxAppDefinition extends AppDefinition {
  constructor() {
    super(MUX_DEFINITION);
  }
}

export default MUX_DEFINITION;
