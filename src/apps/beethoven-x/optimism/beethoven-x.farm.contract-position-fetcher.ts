import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BeethovenXFarmContractPositionFetcher } from '../common/beethoven-x.farm.contract-position-fetcher';

@PositionTemplate()
export class OptimismBeethovenXFarmContractPositionFetcher extends BeethovenXFarmContractPositionFetcher {
  groupLabel = 'Farms';
  subgraphUrl = 'https://backend-v3.beets-ftm-node.com';
}
