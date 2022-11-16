import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const IRON_BANK_DEFINITION = appDefinition({
  id: 'iron-bank',
  name: 'Iron Bank',
  description:
    'Iron Bank is a decentralized protocol to protocol lending platform. It allows trusted protocols to borrow funds without posting collateral via whitelisting.',
  url: 'https://app.ib.xyz/',
  groups: {
    supply: { id: 'supply', type: GroupType.TOKEN, label: 'Lending' },
    borrow: { id: 'borrow', type: GroupType.POSITION, label: 'Lending' },
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
  links: {
    medium: 'https://ibdotxyz.medium.com/',
    twitter: 'https://twitter.com/ibdotxyz',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.FANTOM_OPERA_MAINNET]: [AppAction.VIEW],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(IRON_BANK_DEFINITION.id)
export class IronBankAppDefinition extends AppDefinition {
  constructor() {
    super(IRON_BANK_DEFINITION);
  }
}

export default IRON_BANK_DEFINITION;
