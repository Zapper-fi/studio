import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const GEARBOX_DEFINITION = appDefinition({
  id: 'gearbox',
  name: 'gearbox',
  description: 'Composable Leverage Protocol',
  url: 'https://gearbox.fi ',
  groups: {
    lending: {
      id: 'lending',
      type: GroupType.TOKEN,
      label: 'Lending',
    },
  },
  tags: [AppTag.COLLATERALIZED_DEBT_POSITION, AppTag.FARMING, AppTag.LENDING],
  keywords: [],
  links: {},

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
