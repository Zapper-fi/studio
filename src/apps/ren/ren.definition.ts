import { Register } from '~app-toolkit/decorators';
import { AppDefinition, appDefinition } from '~app/app.definition';
import { AppAction, AppTag, GroupType } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const REN_DEFINITION = appDefinition({
  id: 'ren',
  name: 'Ren',
  description: `Provides access to inter-blockchain liquidity for all decentralized applications. Brings BTC, BCH, ZEC and more to Ethereum.`,
  primaryColor: '#f5f6f8',
  url: 'https://renproject.io/',
  tags: [AppTag.INFRASTRUCTURE],
  links: {},

  groups: {
    darknode: {
      id: 'darknode',
      type: GroupType.POSITION,
      label: 'Darknodes',
    },
  },

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  token: {
    address: '0x408e41876cccdc0f92210600ef50372656052a38',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(REN_DEFINITION.id)
export class RenModuleAppDefinition extends AppDefinition {
  constructor() {
    super(REN_DEFINITION);
  }
}
