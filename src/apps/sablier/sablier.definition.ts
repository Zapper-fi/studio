import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const SABLIER_DEFINITION = appDefinition({
  id: 'sablier',
  name: 'Sablier',
  description: `On Sablier, as a worker, you see your earnings increasing in real-time in the Sablier wallet. As an organisation, Sablier technology helps you get rid of the hassle of payroll admin.`,
  url: 'https://sablier.finance/',
  tags: [AppTag.PAYMENTS],

  links: {
    github: 'https://github.com/sablierhq',
    twitter: 'https://twitter.com/sablierhq',
    medium: 'https://medium.com/sablier',
    discord: 'https://discord.gg/bSwRCwWRsT',
  },

  groups: {
    stream: {
      id: 'stream',
      type: GroupType.POSITION,
      label: 'Streams',
    },

    streamLegacy: {
      id: 'stream-legacy',
      type: GroupType.POSITION,
      label: 'Streams (Legacy)',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(SABLIER_DEFINITION.id)
export class SablierAppDefinition extends AppDefinition {
  constructor() {
    super(SABLIER_DEFINITION);
  }
}
