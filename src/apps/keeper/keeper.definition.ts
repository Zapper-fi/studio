import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const KEEPER_DEFINITION = appDefinition({
  id: 'keeper',
  name: 'keeper',
  description: 'Keep3r',
  url: 'https://keep3r.network/',

  groups: {
    klp: {
      id: 'klp',
      type: GroupType.TOKEN,
      label: 'klp',
    },

    job: {
      id: 'job',
      type: GroupType.POSITION,
      label: 'Job',
    },
  },

  tags: [AppTag.BONDS, AppTag.INFRASTRUCTURE],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(KEEPER_DEFINITION.id)
export class KeeperAppDefinition extends AppDefinition {
  constructor() {
    super(KEEPER_DEFINITION);
  }
}
