import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const SIDESHIFT_DEFINITION = appDefinition({
  id: 'sideshift',
  name: 'SideShift',
  description: 'SideShift.ai staking vault allows XAI holders to receive 25% revenue share daily',
  url: 'https://sideshift.ai/staking',

  groups: {
    svxai: {
      id: 'svxai',
      type: GroupType.TOKEN,
      label: 'svXAI',
    },
  },

  tags: [AppTag.STAKING],
  keywords: [],
  links: {
    twitter: 'https://twitter.com/sideshiftai',
    github: 'https://github.com/sideshift',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(SIDESHIFT_DEFINITION.id)
export class SideshiftAppDefinition extends AppDefinition {
  constructor() {
    super(SIDESHIFT_DEFINITION);
  }
}
