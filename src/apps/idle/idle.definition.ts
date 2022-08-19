import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const IDLE_DEFINITION = appDefinition({
  id: 'idle',
  name: 'Idle',
  description:
    'Idle Finance is a yield aggregator and rebalancing protocol with high-security standards and a product suite aimed at portfolio risk diversification and yield enhancement.',
  url: 'https://idle.finance',

  groups: {
    vault: {
      id: 'vault',
      type: GroupType.TOKEN,
      label: 'Idle',
      groupLabel: 'Best-Yield',
    },
     pyt: {
      id: 'pyt',
      type: GroupType.TOKEN,
      label: 'Perpetual-Yield-Tranches',
    },
  },

  tags: [AppTag.YIELD_AGGREGATOR],
  keywords: [],

  links: {
    twitter: 'https://twitter.com/idlefinance',
    telegram: 'https://t.me/idlefinance',
    discord: 'https://discord.com/invite/mpySAJp',
    medium: 'https://medium.com/idle-finance',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',

  token: {
    address: '0x875773784Af8135eA0ef43b5a374AaD105c5D39e',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(IDLE_DEFINITION.id)
export class IdleAppDefinition extends AppDefinition {
  constructor() {
    super(IDLE_DEFINITION);
  }
}

export default IDLE_DEFINITION;
