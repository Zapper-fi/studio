import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const COSLEND_DEFINITION = appDefinition({
  id: 'coslend',
  name: 'Coslend',
  description: 'Coslend lending protocol is the first money market on Evmos Ecosystem based on Compound.',
  url: 'https://coslend.com',
  groups: {
    supply: {
      id: 'supply',
      type: GroupType.TOKEN,
      label: 'Lending',
      groupLabel: 'Supply',
    },
    borrow: {
      id: 'borrow',
      type: GroupType.POSITION,
      label: 'Lending',
      groupLabel: 'Borrow',
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
  keywords: ['lending', 'defi', 'evmos', 'ethereum', 'cosmos', 'decentralized finance', 'coslend'],
  links: {
    github: 'https://github.com/coslendteam',
    twitter: 'https://twitter.com/coslend',
    discord: 'https://discord.com/invite/3ykeh6cXrT',
    medium: 'https://medium.com/@coslend',
  },
  supportedNetworks: {
    [Network.EVMOS_MAINNET]: [AppAction.VIEW],
  },
  primaryColor: '#e921c3',
});

@Register.AppDefinition(COSLEND_DEFINITION.id)
export class CoslendAppDefinition extends AppDefinition {
  constructor() {
    super(COSLEND_DEFINITION);
  }
}

export default COSLEND_DEFINITION;
