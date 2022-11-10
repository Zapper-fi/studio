import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberswapElasticFarmContractPositionFetcher } from '../common/kyberswap-elastic.farm.contract-position-fetcher';

@PositionTemplate()
export class OptimismKyberswapElasticFarmContractPositionFetcher extends KyberswapElasticFarmContractPositionFetcher {
  groupLabel = 'Farms';

  kyberswapElasticLmAddress = '0xb85ebe2e4ea27526f817ff33fb55fb240057c03f';
}
