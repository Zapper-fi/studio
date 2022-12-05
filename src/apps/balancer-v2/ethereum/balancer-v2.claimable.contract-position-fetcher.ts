import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BalancerV2ClaimableContractPositionFetcher } from '../common/balancer-v2.claimable.contract-position-fetcher';

@PositionTemplate()
export class EthereumBalancerV2ClaimableContractPositionFetcher extends BalancerV2ClaimableContractPositionFetcher {
  groupLabel = 'Claimable';
}
