import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const AAVE_V2_DEFINITION = appDefinition({
  id: 'aave-v2',
  name: 'Aave V2',
  description: `Aave is a decentralized non-custodial liquidity protocol where users can participate as depositors or borrowers.`,
  tags: [AppTag.LENDING],

  groups: {
    supply: {
      id: 'supply',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    stableDebt: {
      id: 'stable-debt',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    variableDebt: {
      id: 'variable-debt',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    claimable: {
      id: 'claimable',
      type: GroupType.TOKEN,
      label: 'Reward',
    },
  },

  // First case
  exploreViewConfig: {
    tabs: [
      {
        label: 'Lending',
        viewType: 'list',
        groupIds: ['supply'],
      },
      {
        label: 'Borrow',
        viewType: 'list',
        groupIds: ['variable-debt', 'stable-debt'],
      },
    ],
  },

  // Second case
  exploreViewConfig: {
    tabs: [
      {
        label: 'Lending',
        viewType: 'list',
        groupIds: ['supply'],
      },
      {
        label: 'Borrow',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Stable',
            groupIds: ['stable-debt'],
          },
          {
            viewType: 'list',
            label: 'Variable',
            groupIds: ['variable-debt'],
          },
        ],
      },
    ],
  },

  // Third case
  exploreViewConfig: {
    tabs: [
      {
        label: 'Lending',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Supply',
            groupIds: ['supply'],
          },
          {
            viewType: 'split',
            label: 'Borrow',
            views: [
              {
                label: 'Stable',
                groupIds: ['stable-debt'],
              },
              {
                label: 'Variable',
                groupIds: ['variable-debt'],
              },
            ],
          },
        ],
      },
    ],
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW, AppAction.TRANSACT],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW, AppAction.TRANSACT],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW, AppAction.TRANSACT],
  },

  primaryColor: '#1c1d26',
  url: 'https://aave.com/',

  links: {
    github: 'https://github.com/aave',
    twitter: 'https://twitter.com/AaveAave',
    discord: 'https://discord.gg/CvKUrqM',
    telegram: 'https://t.me/Aavesome',
    medium: 'https://medium.com/aave',
  },

  token: {
    address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(AAVE_V2_DEFINITION.id)
export class AaveV2AppDefinition extends AppDefinition {
  constructor() {
    super(AAVE_V2_DEFINITION);
  }
}
