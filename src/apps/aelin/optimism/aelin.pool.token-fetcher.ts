import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AelinPoolTokenFetcher } from '../common/aelin.pool.token-fetcher';

@PositionTemplate()
export class OptimismAelinPoolTokenFetcher extends AelinPoolTokenFetcher {
  groupLabel = 'Pools';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/aelin-xyz/aelin-optimism?source=zapper';
}
