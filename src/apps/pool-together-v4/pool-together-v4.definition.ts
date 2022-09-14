import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const POOL_TOGETHER_V4_DEFINITION = appDefinition({
  id: 'pool-together-v4',
  name: 'PoolTogetherV4',
  description: `PoolTogether is a crypto-powered savings protocol based on Premium Bonds. Save money and have a chance to win every week.`,
  url: 'https://pooltogether.com/',
  links: {
    github: 'https://github.com/pooltogether',
    twitter: 'https://twitter.com/PoolTogether_',
    discord: 'https://pooltogether.com/discord',
    telegram: 'https://t.me/pooltogether',
    medium: 'https://medium.com/pooltogether',
  },
  groups: {
    ticket: { id: 'ticket', type: GroupType.TOKEN, label: 'Prize Pools' },
    communityTicket: { id: 'community-ticket', type: GroupType.TOKEN, label: 'Community Prize Pools' },
  },
  tags: [AppTag.LOTTERY],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW, AppAction.TRANSACT],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW, AppAction.TRANSACT],
    [Network.AVALANCHE_MAINNET]: [AppAction.VIEW],
    [Network.OPTIMISM_MAINNET]: [AppAction.VIEW],
  },
  primaryColor: '#843ff3',
  token: {
    address: '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(POOL_TOGETHER_V4_DEFINITION.id)
export class PoolTogetherV4AppDefinition extends AppDefinition {
  constructor() {
    super(POOL_TOGETHER_V4_DEFINITION);
  }
}

export default POOL_TOGETHER_V4_DEFINITION;
