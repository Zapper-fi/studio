import { Register } from '~app-toolkit/decorators';
import { appDefinition, AppDefinition } from '~app/app.definition';
import { GroupType, AppAction, AppTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const POOL_TOGETHER_V3_DEFINITION = appDefinition({
  id: 'pool-together-v3',
  name: 'PoolTogetherV3',
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
    ticket: {
      id: 'ticket',
      type: GroupType.TOKEN,
      label: 'Prize Pools',
      isHiddenFromExplore: true,
    },
    sponsorship: {
      id: 'sponsorship',
      type: GroupType.TOKEN,
      label: 'Prize Pools',
      isHiddenFromExplore: true,
    },
    airdrop: { id: 'airdop', type: GroupType.TOKEN, label: 'Airdrops', isHiddenFromExplore: true },
    claimable: { id: 'claimable', type: GroupType.TOKEN, label: 'Rewards', isHiddenFromExplore: true },
    pod: { id: 'pod', type: GroupType.TOKEN, label: 'Prize Pods', isHiddenFromExplore: true },
  },
  tags: [AppTag.LOTTERY],
  supportedNetworks: {
    [Network.CELO_MAINNET]: [AppAction.VIEW, AppAction.TRANSACT],
    [Network.ETHEREUM_MAINNET]: [AppAction.VIEW, AppAction.TRANSACT],
    [Network.POLYGON_MAINNET]: [AppAction.VIEW, AppAction.TRANSACT],
  },
  primaryColor: '#843ff3',
  token: {
    address: '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e',
    network: Network.ETHEREUM_MAINNET,
  },
});

@Register.AppDefinition(POOL_TOGETHER_V3_DEFINITION.id)
export class PoolTogetherV3AppDefinition extends AppDefinition {
  constructor() {
    super(POOL_TOGETHER_V3_DEFINITION);
  }
}

export default POOL_TOGETHER_V3_DEFINITION;
