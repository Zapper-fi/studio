import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const EULER_DEFINITION = appDefinition({
  id: 'euler',
  name: 'Euler',
  description:
    'Euler is a non-custodial protocol on Ethereum that allows users to lend and borrow almost any crypto asset.',
  url: 'https://app.euler.finance/',

  groups: {
    eToken: {
      id: 'e-token',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    dToken: {
      id: 'd-token',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    pToken: {
      id: 'p-token',
      type: GroupType.TOKEN,
      label: 'P Token',
      isHiddenFromExplore: true,
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
            groupIds: ['e-token'],
          },
          {
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['d-token'],
          },
        ],
      },
    ],
  },
  tags: [AppTag.LENDING],
  keywords: [],
  links: {
    twitter: 'https://twitter.com/eulerfinance',
    discord: 'https://discord.com/invite/CdG97VSYGk',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(EULER_DEFINITION.id)
export class EulerAppDefinition extends AppDefinition {
  constructor() {
    super(EULER_DEFINITION);
  }
}

export default EULER_DEFINITION;
