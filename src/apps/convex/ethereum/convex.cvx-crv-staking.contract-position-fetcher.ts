import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ConvexFarmContractPositionFetcher } from '../common/convex.farm.contract-position-fetcher';

@PositionTemplate()
export class EthereumConvexCvxCrvStakingContractPositionFetcher extends ConvexFarmContractPositionFetcher {
  groupLabel = 'cvxCRV Staking';

  getFarmAddresses() {
    return ['0x3fe65692bfcd0e6cf84cb1e7d24108e434a7587e'];
  }
}
