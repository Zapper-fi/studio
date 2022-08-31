import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const PLATYPUS_FINANCE_DEFINITION = appDefinition({
  id: 'platypus-finance',
  name: 'Platypus Finance',
  description: `The Platypus Finance protocol is a single-side AMM designed for exchanging stable cryptocurrencies on the Avalanche blockchain. `,
  url: 'https://platypus.finance/',
  primaryColor: '#1c1d26',
  tags: [AppTag.DECENTRALIZED_EXCHANGE],

  links: {
    discord: 'discord.gg/B6ThAvev2A',
    github: 'https://github.com/platypus-finance',
    medium: 'https://medium.com/@Platypus.finance',
    telegram: 't.me/Platypusdefi',
    twitter: 'https://twitter.com/Platypusdefi',
  },

  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Pools',
    },

    altPool: {
      id: 'alt-pool',
      type: GroupType.TOKEN,
      label: 'Alt Pools',
    },

    farm: {
      id: 'farm',
      type: GroupType.POSITION,
      label: 'Staked',
    },

    chef: {
      id: 'chef',
      type: GroupType.POSITION,
      label: 'Staked',
    },

    votingEscrow: {
      id: 'voting-escrow',
      type: GroupType.POSITION,
      label: 'Voting Escrow',
    },
  },

  supportedNetworks: {
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
  },

  token: {
    address: '0x22d4002028f537599be9f666d1c4fa138522f9c8',
    network: Network.AVALANCHE_MAINNET,
  },
});

@Register.AppDefinition(PLATYPUS_FINANCE_DEFINITION.id)
export class PlatypusFinanceAppDefinition extends AppDefinition {
  constructor() {
    super(PLATYPUS_FINANCE_DEFINITION);
  }
}
