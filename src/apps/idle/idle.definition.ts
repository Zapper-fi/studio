import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const IDLE_DEFINITION = appDefinition({
  id: 'idle',
  name: 'Idle',
  description:
    'Idle is a decentralized rebalancing protocol that allows users to automatically and algorithmically manage their digital asset allocation among different third-party DeFi protocols.',
  url: 'https://idle.finance/',

  groups: {
    vault: {
      id: 'vault',
      type: GroupType.TOKEN,
      label: 'Idle',
      groupLabel: 'Farms',
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
});

@Register.AppDefinition(IDLE_DEFINITION.id)
export class IdleAppDefinition extends AppDefinition {
  constructor() {
    super(IDLE_DEFINITION);
  }
}

export default IDLE_DEFINITION;
