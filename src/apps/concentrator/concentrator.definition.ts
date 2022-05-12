import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const CONCENTRATOR_DEFINITION = appDefinition({
  id: 'concentrator',
  name: 'concentrator',
  description: 'Boost your Convex yields by ~50%',
  url: 'https://concentrator.aladdin.club/',
  groups: {
    acrv: {
      id: 'acrv',
      type: GroupType.TOKEN,
      label: 'Farm',
    },
    pool: {
      id: 'pool',
      type: GroupType.POSITION,
      label: 'Pools',
    }
  },

  tags: [AppTag.FARMING],
  keywords: [],
  links: {
    github: 'https://github.com/AladdinDAO'
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(CONCENTRATOR_DEFINITION.id)
export class ConcentratorAppDefinition extends AppDefinition {
  constructor() {
    super(CONCENTRATOR_DEFINITION);
  }
}

export default CONCENTRATOR_DEFINITION;
