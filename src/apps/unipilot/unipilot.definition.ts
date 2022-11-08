import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const UNIPILOT_DEFINITION = appDefinition({
  id: 'unipilot',
  name: 'unipilot',
  description:
    '"Unipilot manages your Uniswap v3 liquidity for you, keeping it in an optimal range so you can earn higher returns and save on gas."',
  url: '"https://unipilot.io/"',

  groups: {
    pool: {
      id: 'pool',
      type: GroupType.TOKEN,
      label: 'Vaults',
    },
  },

  tags: [AppTag.ASSET_MANAGEMENT],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(UNIPILOT_DEFINITION.id)
export class UnipilotAppDefinition extends AppDefinition {
  constructor() {
    super(UNIPILOT_DEFINITION);
  }
}

export default UNIPILOT_DEFINITION;
