import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const IMPERMAX_DEFINITION = appDefinition({
  id: 'impermax',
  name: 'Impermax',
  description: 'Impermax enables permissionless lending for Leveraged Yield Farming',
  url: 'https://www.impermax.finance/',
  groups: {
    lend: {
      id: 'lend',
      type: GroupType.TOKEN,
      label: 'Lending Pool',
      groupLabel: 'Supply',
    },
    collateral: {
      id: 'collateral',
      type: GroupType.TOKEN,
      label: 'Lending Pool',
      groupLabel: 'Pools',
    },
    borrow: {
      id: 'borrow',
      type: GroupType.POSITION,
      label: 'Lending Pool',
      groupLabel: 'Borrow',
    },
  },
  tags: [AppTag.LENDING],
  keywords: [],
  links: {
    github: 'https://github.com/Impermax-Finance',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(IMPERMAX_DEFINITION.id)
export class ImpermaxAppDefinition extends AppDefinition {
  constructor() {
    super(IMPERMAX_DEFINITION);
  }
}

export default IMPERMAX_DEFINITION;
