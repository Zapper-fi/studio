import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberswapElasticFarmContractPositionFetcher } from '../common/kyberswap-elastic.farm.contract-position-fetcher';

@PositionTemplate()
export class PolygonKyberswapElasticFarmContractPositionFetcher extends KyberswapElasticFarmContractPositionFetcher {
  groupLabel = 'Farms';

  kyberswapElasticLmAddress = '0xbdec4a045446f583dc564c0a227ffd475b329bf0';
}
