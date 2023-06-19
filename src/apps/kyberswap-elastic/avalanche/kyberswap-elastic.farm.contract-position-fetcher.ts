import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberswapElasticFarmContractPositionFetcher } from '../common/kyberswap-elastic.farm.contract-position-fetcher';

@PositionTemplate()
export class AvalancheKyberswapElasticFarmContractPositionFetcher extends KyberswapElasticFarmContractPositionFetcher {
  groupLabel = 'Farms';

  kyberswapElasticLmAddress = '0x7d5ba536ab244aaa1ea42ab88428847f25e3e676';
}
