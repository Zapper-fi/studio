import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const GEIST_DEFINITION = appDefinition({
  id: 'geist',
  name: 'Geist',
  description: `Geist is a decentralised non-custodial liquidity market protocol where users can participate as depositors or borrowers. Depositors provide liquidity to the market to earn a passive income, while borrowers are able to borrow in an overcollateralised (perpetually) or undercollateralised (one-block liquidity) fashion.`,
  url: 'https://geist.finance/',
  tags: [AppTag.LENDING],
  primaryColor: '#bcfd71',
  links: {},

  groups: {
    platformFees: {
      id: 'platform-fees',
      type: GroupType.POSITION,
      label: 'Platform Fees',
    },

    incentives: {
      id: 'incentives',
      type: GroupType.POSITION,
      label: 'Incentives',
    },

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
  },
  presentationConfig: {
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
                viewType: 'list',
                label: 'Variable',
                groupIds: ['variable-debt'],
              },
              {
                viewType: 'list',
                label: 'Stable',
                groupIds: ['stable-debt'],
              },
            ],
          },
        ],
      },
    ],
  },

  supportedNetworks: {
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW, AppAction.TRANSACT],
  },

  token: {
    address: '0xd8321aa83fb0a4ecd6348d4577431310a6e0814d',
    network: Network.FANTOM_OPERA_MAINNET,
  },
});

@Register.AppDefinition(GEIST_DEFINITION.id)
export class GeistAppDefinition extends AppDefinition {
  constructor() {
    super(GEIST_DEFINITION);
  }
}
