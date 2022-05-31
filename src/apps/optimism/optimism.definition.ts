import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const OPTIMISM_DEFINITION = appDefinition({
  id: 'optimism',
  name: 'Optimism',
  description:
    'Optimism is a Layer 2 Optimistic Rollup network designed to utilize the strong security guarantees of Ethereum while reducing its cost and latency.',
  url: 'https://www.optimism.io/',

  groups: {
    airdrop: {
      id: 'airdrop',
      type: GroupType.TOKEN,
      label: 'Airdrop',
    },
  },

  tags: [AppTag.INFRASTRUCTURE],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
});

@Register.AppDefinition(OPTIMISM_DEFINITION.id)
export class OptimismAppDefinition extends AppDefinition {
  constructor() {
    super(OPTIMISM_DEFINITION);
  }
}

export default OPTIMISM_DEFINITION;
