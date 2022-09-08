import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const AGAVE_DEFINITION = appDefinition({
  id: 'agave',
  name: 'Agave',
  description:
    'Agave rewards depositors with passive income and lets them use their deposits as collateral to borrow and lend digital assets.',
  url: 'https://agave.finance/',

  groups: {
    deposit: {
      id: 'deposit',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    stableBorrow: {
      id: 'stable-borrow',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    variableBorrow: {
      id: 'variable-borrow',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    claimable: {
      id: 'claimable',
      type: GroupType.POSITION,
      label: 'Rewards',
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
            label: 'Deposit',
            groupIds: ['deposit'],
          },
          {
            viewType: 'split',
            label: 'Borrow',
            views: [
              {
                viewType: 'list',
                label: 'Variable',
                groupIds: ['variable-borrow'],
              },
              {
                viewType: 'list',
                label: 'Stable',
                groupIds: ['stable-borrow'],
              },
            ],
          },
        ],
      },
    ],
  },

  tags: [AppTag.LENDING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.GNOSIS_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(AGAVE_DEFINITION.id)
export class AgaveAppDefinition extends AppDefinition {
  constructor() {
    super(AGAVE_DEFINITION);
  }
}

export default AGAVE_DEFINITION;
