import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const GOOD_GHOSTING_DEFINITION = appDefinition({
  id: 'good-ghosting',
  name: 'GoodGhosting',
  description:
    'A better way to grow your savings. The new addictive way to save. Our savings pools reward regular savers with higher interest rates and extra rewards.',
  url: 'https://goodghosting.com',

  groups: {
    game: {
      id: 'game',
      type: GroupType.POSITION,
      label: 'Games',
      groupLabel: 'Farms',
    },
  },

  tags: [AppTag.ASSET_MANAGEMENT, AppTag.FARMING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.CELO_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(GOOD_GHOSTING_DEFINITION.id)
export class GoodGhostingAppDefinition extends AppDefinition {
  constructor() {
    super(GOOD_GHOSTING_DEFINITION);
  }
}

export default GOOD_GHOSTING_DEFINITION;
