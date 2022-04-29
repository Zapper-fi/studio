import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { AppDefinitionObject, GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const POOL_TOGETHER_DEFINITION: AppDefinitionObject = {
  id: 'pool-together',
  name: 'PoolTogether',
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
    pod: { id: 'pod', type: GroupType.POSITION },
    prizeTicket: { id: 'prize-ticket', type: GroupType.TOKEN },
    claimable: { id: 'claimable', type: GroupType.TOKEN },
    vault: { id: 'vault', type: GroupType.TOKEN },
  },
  tags: [ProtocolTag.NO_LOSS_LOTTERY],
  supportedNetworks: {
    [Network.CELO_MAINNET]: [ProtocolAction.VIEW, ProtocolAction.TRANSACT],
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW, ProtocolAction.TRANSACT],
    [Network.POLYGON_MAINNET]: [ProtocolAction.VIEW, ProtocolAction.TRANSACT],
    [Network.AVALANCHE_MAINNET]: [ProtocolAction.VIEW],
  },
  primaryColor: '#843ff3',
  token: {
    address: '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e',
    network: Network.ETHEREUM_MAINNET,
  },
};

@Register.AppDefinition(POOL_TOGETHER_DEFINITION.id)
export class PoolTogetherAppDefinition extends AppDefinition {
  constructor() {
    super(POOL_TOGETHER_DEFINITION);
  }
}

export default POOL_TOGETHER_DEFINITION;
