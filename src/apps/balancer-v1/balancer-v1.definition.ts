import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const BALANCER_V1_DEFINITION = {
  id: 'balancer-v1',
  name: 'Balancer V1',
  description:
    'Balancer is a flexible and versatile Automated Market Maker, giving developers customizability over the weights of the underlying tokens in AMM pools. This project is deprecated in favour of V2.',
  url: 'https://pools.balancer.exchange/',
  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN },
  },
  tags: [ProtocolTag.LIQUIDITY_POOL],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
  },
  token: {
    address: '0xba100000625a3754423978a60c9317c58a424e3d',
    network: Network.ETHEREUM_MAINNET,
  },
  primaryColor: '#1c1d26',
};

@Register.AppDefinition(BALANCER_V1_DEFINITION.id)
export class BalancerV1AppDefinition extends AppDefinition {
  constructor() {
    super(BALANCER_V1_DEFINITION);
  }
}

export default BALANCER_V1_DEFINITION;
