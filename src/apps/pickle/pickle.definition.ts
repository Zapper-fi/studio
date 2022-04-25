import { Register } from '~app-toolkit/decorators';
import { AppDefinition } from '~app/app.definition';
import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';
import { Network } from '~types/network.interface';

export const PICKLE_DEFINITION = {
  id: 'pickle',
  name: 'Pickle',
  description: `Pickle Finance helps users to maximize their DeFi yields by auto-compounding their rewards, saving them time and gas.`,
  url: 'https://pickle.finance/',
  groups: {
    jar: { id: 'jar', type: GroupType.TOKEN },
    votingEscrow: { id: 'voting-escrow', type: GroupType.POSITION },
    masterchefFarm: { id: 'masterchef-farm', type: GroupType.POSITION },
    masterchefV2Farm: { id: 'masterchef-v2-farm', type: GroupType.POSITION },
    singleStakingFarm: { id: 'single-staking-farm', type: GroupType.POSITION },
  },
  primaryColor: '#1b8d54',
  tags: [ProtocolTag.YIELD_AGGREGATOR],
  supportedNetworks: {
    [Network.ETHEREUM_MAINNET]: [ProtocolAction.VIEW],
    [Network.ARBITRUM_MAINNET]: [ProtocolAction.VIEW],
    [Network.POLYGON_MAINNET]: [ProtocolAction.VIEW],
  },
  token: {
    address: '0x429881672b9ae42b8eba0e26cd9c73711b891ca5',
    network: Network.ETHEREUM_MAINNET,
  },
};

@Register.AppDefinition(PICKLE_DEFINITION.id)
export class PickleAppDefinition extends AppDefinition {
  constructor() {
    super(PICKLE_DEFINITION);
  }
}
