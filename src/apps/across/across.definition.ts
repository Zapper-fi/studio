import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const ACROSS_DEFINITION = appDefinition({
  id: 'across',
  name: 'Across',
  description: 'Across is the fastest, cheapest and most secure cross-chain bridge.',
  url: 'https://across.to',
  groups: {
    v1Pool: {
      id: 'v1-pool',
      type: GroupType.TOKEN,
      label: 'V1 Pools',
    },
  },
  tags: [AppTag.BRIDGE, AppTag.CROSS_CHAIN],
  links: {
    learn: 'https://docs.across.to/bridge/',
    github: 'https://github.com/across-protocol',
    twitter: '',
    telegram: '',
    discord: 'https://discord.gg/across',
    medium: '',
  },
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },
  primaryColor: '#fff',
});

@Register.AppDefinition(ACROSS_DEFINITION.id)
export class AcrossAppDefinition extends AppDefinition {
  constructor() {
    super(ACROSS_DEFINITION);
  }
}

export default ACROSS_DEFINITION;
