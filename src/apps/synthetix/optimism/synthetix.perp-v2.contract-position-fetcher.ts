import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { OptimismSynthetixPerpContractPositionFetcher } from './synthetix.perp.contract-position-fetcher';

@PositionTemplate()
export class OptimismSynthetixPerpV2ContractPositionFetcher extends OptimismSynthetixPerpContractPositionFetcher {
  groupLabel = 'PerpV2';

  marketFilter(market) {
    return this.isV2Market(market);
  }
}
