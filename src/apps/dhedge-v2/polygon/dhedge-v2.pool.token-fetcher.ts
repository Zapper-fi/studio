import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { DhedgeV2PoolTokenFetcher } from '../common/dhedge-v2.pool.token-fetcher';

@PositionTemplate()
export class PolygonDhedgeV2PoolTokenFetcher extends DhedgeV2PoolTokenFetcher {
  groupLabel = 'Pools';

  factoryAddress = '0xfdc7b8bfe0dd3513cc669bb8d601cb83e2f69cb0';
  underlyingTokenAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';
}
