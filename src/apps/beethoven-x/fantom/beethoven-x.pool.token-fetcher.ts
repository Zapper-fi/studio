import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BeethovenXPoolTokenFetcher } from '../common/beethoven-x.pool.token-fetcher';

@PositionTemplate()
export class FantomBeethovenXPoolTokenFetcher extends BeethovenXPoolTokenFetcher {
  subgraphUrl = 'https://backend-v2.beets-ftm-node.com/graphql';
  vaultAddress = '0x20dd72ed959b6147912c2e529f0a0c651c33c9ce';
  composablePoolFactory = '0xb384a86f2fd7788720db42f9daa60fc07ecbea06';
  weightedPoolV2Factory = '0x8ea1c497c16726e097f62c8c9fbd944143f27090';

  groupLabel = 'Pools';
}
