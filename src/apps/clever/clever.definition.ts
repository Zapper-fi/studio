import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const CLEVER_DEFINITION = appDefinition({
  id: 'clever',
  name: 'CLever',
  description:
    'CLever gives CVX holders a continuous, automated way to harvest bribes and rewards AND allows users to claim their future bribes and rewards today.',
  url: 'https://clever.aladdin.club/#/clever',

  groups: {
    lever: {
      id: 'lever',
      type: GroupType.TOKEN,
      label: 'ClevCVX',
    },

    lock: {
      id: 'lock',
      type: GroupType.POSITION,
      label: 'Lock',
    },

    furnace: {
      id: 'furnace',
      type: GroupType.POSITION,
      label: 'Furnace',
    },
  },

  tags: [AppTag.FARMING],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(CLEVER_DEFINITION.id)
export class CleverAppDefinition extends AppDefinition {
  constructor() {
    super(CLEVER_DEFINITION);
  }
}

export default CLEVER_DEFINITION;
