import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const LIQUITY_DEFINITION = {
  id: 'liquity',
  name: 'Liquity',
  description:
    'Liquity is a decentralized borrowing protocol that allows you to draw interest-free loans against Ether used as collateral.',
  url: 'https://www.liquity.org/',
  groups: {
    farm: { id: 'farm', type: GroupType.POSITION },
    trove: { id: 'trove', type: GroupType.POSITION },
    stabilityPool: { id: 'stability-pool', type: GroupType.POSITION },
  },
  tags: [ProtocolTag.LENDING],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
  },
  primaryColor: '#fff',
  token: {
    address: '0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d',
    network: Network.ETHEREUM_MAINNET,
  },
};

@Register.AppDefinition(LIQUITY_DEFINITION.id)
export class LiquityAppDefinition extends AppDefinition {
  constructor() {
    super(LIQUITY_DEFINITION);
  }
}

export default LIQUITY_DEFINITION;
