import {Register} from '~app-toolkit/decorators';
import {appDefinition, AppDefinition} from '~app/app.definition';
import {AppAction, AppTag, GroupType} from '~app/app.interface';
import {Network} from '~types/network.interface';

export const BOLIDE_DEFINITION = appDefinition({
  id: 'bolide',
  name: 'Bolide',
  description: 'Bolide is a next-generation decentralized yield aggregator that optimizes the deployment of digital assets across multiple DeFi platforms to save time, money and earn them the highest possible yields..',
  url: 'https://bolide.fi/',
  groups: {
    vault: {
      id: 'vault',
      type: GroupType.POSITION,
      label: 'Vaults',
    },
  },
  tags: [AppTag.BRIDGE],
  keywords: [],
  links: {},

  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
  },

  primaryColor: '#fff',
  token: {
    address: '0x8A7aDc1B690E81c758F1BD0F72DFe27Ae6eC56A5',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(BOLIDE_DEFINITION.id)
export class BolideAppDefinition extends AppDefinition {
  constructor() {
    super(BOLIDE_DEFINITION);
  }
}

export default BOLIDE_DEFINITION;
