import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { OptimismSynthetixPerpContractPositionFetcher } from './synthetix.perp.contract-position-fetcher';

@PositionTemplate()
export class OptimismSynthetixPerpV1ContractPositionFetcher extends OptimismSynthetixPerpContractPositionFetcher {
  groupLabel = 'PerpV1';
  extraLabel = ' (v1)'

  marketFilter(market) {
    return !this.isV2Market(market);
  }
}
