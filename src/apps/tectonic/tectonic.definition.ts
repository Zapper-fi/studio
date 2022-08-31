import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const TECTONIC_DEFINITION = appDefinition({
  id: 'tectonic',
  name: 'Tectonic',
  description:
    'Tectonic is the first DeFi protocol designed to maximize capital efficiency, benefiting liquidity providers, traders, and borrowers.',
  url: 'https://tectonic.finance/',

  groups: {
    claimable: {
      id: 'claimable',
      type: GroupType.POSITION,
      label: 'Claimable',
      isHiddenFromExplore: true,
    },

    supply: {
      id: 'supply',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    borrow: {
      id: 'borrow',
      type: GroupType.POSITION,
      label: 'Lending',
    },

    xtonic: {
      id: 'xtonic',
      type: GroupType.TOKEN,
      label: 'xTONIC',
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
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['borrow'],
          },
        ],
      },
    ],
  },

  tags: [AppTag.LENDING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.CRONOS_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#000024',
});

@Register.AppDefinition(TECTONIC_DEFINITION.id)
export class TectonicAppDefinition extends AppDefinition {
  constructor() {
    super(TECTONIC_DEFINITION);
  }
}

export default TECTONIC_DEFINITION;
