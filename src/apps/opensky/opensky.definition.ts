import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const OPENSKY_DEFINITION = appDefinition({
  id: 'opensky',
  name: 'opensky',
  description:
    'OpenSky Finance is a time-based NFT lending protocol built on top of aave.com which integrates peer-to-pool and peer-to-peer loans.',
  url: 'https://opensky.finance',

  groups: {
    supply: {
      id: 'supply',
      type: GroupType.TOKEN,
      label: 'Supply',
    },
    borrow: {
      id: 'borrow',
      type: GroupType.POSITION,
      label: 'Borrow',
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

  tags: [AppTag.LENDING, AppTag.NFT_LENDING],
  keywords: [],
  links: {
    github: 'https://github.com/OpenSky-Finance',
    twitter: 'https://twitter.com/OpenSkyFinancee',
    discord: 'https://discord.gg/WDPSHnQbN8',
    telegram: 'https://t.me/OpenSkyLabs',
    medium: 'https://openskyfinance.medium.com',
  },
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
  primaryColor: '#fff',
});

@Register.AppDefinition(OPENSKY_DEFINITION.id)
export class OpenskyAppDefinition extends AppDefinition {
  constructor() {
    super(OPENSKY_DEFINITION);
  }
}

export default OPENSKY_DEFINITION;
