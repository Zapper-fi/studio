import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BeethovenXPoolTokenFetcher } from '../common/beethoven-x.pool.token-fetcher';

@PositionTemplate()
export class OptimismBeethovenXPoolTokenFetcher extends BeethovenXPoolTokenFetcher {
  subgraphUrl = 'https://backend-optimism.beets-ftm-node.com/';
  vaultAddress = '0xba12222222228d8ba445958a75a0704d566bf2c8';

  groupLabel = 'Pools';
}
