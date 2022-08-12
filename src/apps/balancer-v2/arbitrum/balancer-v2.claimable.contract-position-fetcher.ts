import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { BALANCER_V2_DEFINITION } from '../balancer-v2.definition';
import { BalancerV2ClaimableContractPositionFetcher } from '../common/balancer-v2.claimable.contract-position-fetcher';

const appId = BALANCER_V2_DEFINITION.id;
const groupId = BALANCER_V2_DEFINITION.groups.claimable.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumBalancerV2ClaimableContractPositionFetcher extends BalancerV2ClaimableContractPositionFetcher {
  appId = BALANCER_V2_DEFINITION.id;
  groupId = BALANCER_V2_DEFINITION.groups.claimable.id;
  network = Network.ARBITRUM_MAINNET;
}
