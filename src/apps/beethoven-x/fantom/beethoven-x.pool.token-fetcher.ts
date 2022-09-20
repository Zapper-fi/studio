import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BeethovenXPoolTokenFetcher } from '../common/beethoven-x.pool.token-fetcher';

@PositionTemplate()
export class FantomBeethovenXPoolTokenFetcher extends BeethovenXPoolTokenFetcher {
  subgraphUrl = 'https://backend.beets-ftm-node.com/graphql';
  vaultAddress = '0x20dd72ed959b6147912c2e529f0a0c651c33c9ce';

  groupLabel = 'Pools';
}
