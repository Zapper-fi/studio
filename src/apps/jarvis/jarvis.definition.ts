import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const JARVIS_DEFINITION = appDefinition({
  id: 'jarvis',
  name: 'Jarvis',
  description: `Using stable and liquid on-chain fiat currencies to increase financial inclusion and facilitate the access to liquidity and yield to everyone.`,
  url: 'https://jarvis.network/',
  tags: [AppTag.SYNTHETICS],

  links: {
    discord: 'https://discord.com/invite/2GbKwERXDc',
    medium: 'https://medium.com/jarvis-network',
    github: 'https://gitlab.com/jarvis-network',
    twitter: 'https://twitter.com/jarvis_network',
  },

  groups: {
    synth: {
      id: 'synth',
      type: GroupType.TOKEN,
      label: 'Synths',
    },
  },

  supportedNetworks: {
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
  },
});

@Register.AppDefinition(JARVIS_DEFINITION.id)
export class JarvisAppDefinition extends AppDefinition {
  constructor() {
    super(JARVIS_DEFINITION);
  }
}
