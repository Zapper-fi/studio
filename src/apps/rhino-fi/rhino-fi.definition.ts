import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types';

export const RHINO_FI_DEFINITION = appDefinition({
  id: 'rhino-fi',
  name: 'rhino.fi',
  description: `rhino.fi is opening DeFi to the entire world. People shouldn’t have to go through centralised web 3 exchanges to reach financial freedom – we believe they should have a gateway that takes them straight there.`,
  url: 'https://rhino.fi/',

  groups: {
    bridge: {
      id: 'bridge',
      type: GroupType.POSITION,
      label: 'Bridge',
    },

    deposit: {
      id: 'deposit',
      type: GroupType.POSITION,
      label: 'Deposits',
    },
  },
  tags: [AppTag.DECENTRALIZED_EXCHANGE],
  links: {
    discord: 'https://discord.com/invite/26sXx2KAhy',
    twitter: 'https://twitter.com/rhinofi',
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(RHINO_FI_DEFINITION.id)
export class RhinoFiAppDefinition extends AppDefinition {
  constructor() {
    super(RHINO_FI_DEFINITION);
  }
}
