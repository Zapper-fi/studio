import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const BALANCER_V2_DEFINITION = appDefinition({
  id: 'balancer-v2',
  name: 'Balancer V2',
  description:
    'Balancer is a flexible and versatile Automated Market Maker, giving developers customizability over the weights of the underlying tokens in AMM pools.',
  url: 'https://app.balancer.fi/',
  links: {
    github: 'https://github.com/balancer-labs/',
    twitter: 'https://twitter.com/BalancerLabs',
    discord: 'https://discord.balancer.fi/',
    medium: 'https://medium.com/balancer-protocol',
  },
  groups: {
    pool: { id: 'pool', type: GroupType.TOKEN },
    farm: { id: 'farm', type: GroupType.POSITION },
    votingEscrow: { id: 'voting-escrow', type: GroupType.POSITION },
    claimable: { id: 'claimable', type: GroupType.POSITION },
  },
  tags: [AppTag.LIQUIDITY_POOL],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [AppAction.VIEW],
  },
  primaryColor: '#1c1d26',
  token: {
    address: '0xba100000625a3754423978a60c9317c58a424e3d',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(BALANCER_V2_DEFINITION.id)
export class BalancerV2AppDefinition extends AppDefinition {
  constructor() {
    super(BALANCER_V2_DEFINITION);
  }
}

export default BALANCER_V2_DEFINITION;
