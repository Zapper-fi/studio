import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { DhedgeV2PoolTokenFetcher } from '../common/dhedge-v2.pool.token-fetcher';

@PositionTemplate()
export class OptimismDhedgeV2PoolTokenFetcher extends DhedgeV2PoolTokenFetcher {
  groupLabel = 'Pools';

  factoryAddress = '0x5e61a079a178f0e5784107a4963baae0c5a680c6';
  underlyingTokenAddress = '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9';
}
