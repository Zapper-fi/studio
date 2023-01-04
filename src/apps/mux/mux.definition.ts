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
  tags: [AppTag.PERPETUALS_EXCHANGE],
  keywords: [],

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
    },

    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Farms',
    },

    perp: {
      id: 'perp',
      type: GroupType.POSITION,
      label: 'Perpetuals',
    },
  },

  links: {
    discord: 'https://discord.com/invite/bd88NrzN3N',
    github: 'https://github.com/mux-world/mux-protocol',
    telegram: 'https://t.me/muxprotocol',
    twitter: 'https://twitter.com/muxprotocol',
  },

  supportedNetworks: {
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [AppAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(MUX_DEFINITION.id)
export class MuxAppDefinition extends AppDefinition {
  constructor() {
    super(MUX_DEFINITION);
  }
}
