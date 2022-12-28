import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const GEARBOX_DEFINITION = appDefinition({
  id: 'gearbox',
  name: 'Gearbox',
  description: 'Composable Leverage Protocol',
  url: 'https://gearbox.fi ',

  groups: {
    lending: {
      id: 'lending',
      type: GroupType.TOKEN,
      label: 'Lending',
    },

    creditAccounts: {
      id: 'credit-accounts',
      type: GroupType.POSITION,
      label: 'Credit Accounts',
    },

    phantom: {
      id: 'phantom',
      type: GroupType.TOKEN,
      label: 'Phantom Tokens',
    },
  },

  tags: [AppTag.COLLATERALIZED_DEBT_POSITION, AppTag.FARMING, AppTag.LENDING],
  keywords: [],

  links: {
    discord: 'https://discord.com/invite/gearbox',
    github: 'https://github.com/Gearbox-protocol',
    twitter: 'https://twitter.com/GearboxProtocol',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(GEARBOX_DEFINITION.id)
export class GearboxAppDefinition extends AppDefinition {
  constructor() {
    super(GEARBOX_DEFINITION);
  }
}

export default GEARBOX_DEFINITION;
