import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Network } from '~types/network.interface';

import { DhedgeV2PoolTokenFetcher } from '../common/dhedge-v2.pool.token-fetcher';
import { DHEDGE_V_2_DEFINITION } from '../dhedge-v2.definition';

@PositionTemplate()
export class PolygonDhedgeV2PoolTokenFetcher extends DhedgeV2PoolTokenFetcher {
  appId = DHEDGE_V_2_DEFINITION.id;
  groupId = DHEDGE_V_2_DEFINITION.groups.pool.id;
  network = Network.POLYGON_MAINNET;
  groupLabel = 'Pools';

  factoryAddress = '0xfdc7b8bfe0dd3513cc669bb8d601cb83e2f69cb0';
  underlyingTokenAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';
}
