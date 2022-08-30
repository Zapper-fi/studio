import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { PoolTogetherV4ClaimableContractPositionFetcher } from '../common/pool-together-v4.claimable.contract-position-fetcher';
import { POOL_TOGETHER_V4_DEFINITION } from '../pool-together-v4.definition';

const appId = POOL_TOGETHER_V4_DEFINITION.id;
const groupId = POOL_TOGETHER_V4_DEFINITION.groups.claimable.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismPoolTogetherV4ClaimableContractPositionFetcher extends PoolTogetherV4ClaimableContractPositionFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Rewards';
}
