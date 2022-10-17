import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Network } from '~types/network.interface';

import { DhedgeV2PoolTokenFetcher } from '../common/dhedge-v2.pool.token-fetcher';
import { DHEDGE_V_2_DEFINITION } from '../dhedge-v2.definition';

@PositionTemplate()
export class OptimismDhedgeV2PoolTokenFetcher extends DhedgeV2PoolTokenFetcher {
  appId = DHEDGE_V_2_DEFINITION.id;
  groupId = DHEDGE_V_2_DEFINITION.groups.pool.id;
  network = Network.OPTIMISM_MAINNET;
  groupLabel = 'Pools';

  factoryAddress = '0x5e61a079a178f0e5784107a4963baae0c5a680c6';
  underlyingTokenAddress = '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9';
}
