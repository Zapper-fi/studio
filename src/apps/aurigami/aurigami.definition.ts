import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const AURIGAMI_DEFINITION = appDefinition({
  id: 'aurigami',
  name: 'Aurigami',
  description: 'The native money market on Aurora.',
  url: 'https://www.aurigami.finance/',
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
  tags: [AppTag.LENDING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.AURORA_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(AURIGAMI_DEFINITION.id)
export class AurigamiAppDefinition extends AppDefinition {
  constructor() {
    super(AURIGAMI_DEFINITION);
  }
}

export default AURIGAMI_DEFINITION;
