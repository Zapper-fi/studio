import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const BEND_DAO_DEFINITION = appDefinition({
  id: 'bend-dao',
  name: 'BendDAO',
  description:
    'BendDAO is the first NFT liquidity protocol supporting instant NFT-backed loans, Collateral Listing, and NFT Down Payment',
  url: 'https://www.benddao.xyz/',
  groups: {
    supply: {
      id: 'supply',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    variableDebt: {
      id: 'variable-debt',
      type: GroupType.TOKEN,
      label: 'Lending',
    },
  },
  tags: [AppTag.NFT_LENDING],
  keywords: [],
  links: {
    github: 'https://github.com/BendDAO',
    twitter: 'https://twitter.com/benddao',
    discord: 'https://discord.com/invite/benddao',
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
            groupIds: ['variable-debt'],
          },
        ],
      },
    ],
  },
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#0057ff',
  token: {
    address: '0x0d02755a5700414b26ff040e1de35d337df56218',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(BEND_DAO_DEFINITION.id)
export class BendDaoAppDefinition extends AppDefinition {
  constructor() {
    super(BEND_DAO_DEFINITION);
  }
}

export default BEND_DAO_DEFINITION;
