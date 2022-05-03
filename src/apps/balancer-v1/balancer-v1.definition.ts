import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { AppDefinitionObject, GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const BALANCER_V1_DEFINITION: AppDefinitionObject = {
  id: 'balancer-v1',
  name: 'Balancer V1',
  description:
    'Balancer is a flexible and versatile Automated Market Maker, giving developers customizability over the weights of the underlying tokens in AMM pools. This project is deprecated in favour of V2.',
  url: 'https://pools.balancer.exchange/',
  links: {
    github: 'https://github.com/balancer-labs/',
    twitter: 'https://twitter.com/BalancerLabs',
    discord: 'https://discord.balancer.fi/',
    medium: 'https://medium.com/balancer-protocol',
  },
  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN },
  },
  tags: [AppTag.LIQUIDITY_POOL],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
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
