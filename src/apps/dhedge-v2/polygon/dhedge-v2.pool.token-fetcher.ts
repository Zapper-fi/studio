import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';
import { DHEDGE_V_2_DEFINITION } from '../dhedge-v2.definition';
import { DhedgeV2PoolTokenFetcherHelper } from '../helpers/dhedge-v2.pool.token-fetcher-helper'

const appId = DHEDGE_V_2_DEFINITION.id;
const groupId = DHEDGE_V_2_DEFINITION.groups.pool.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonDhedgeV2PoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    private readonly dhedgeV2PoolTokenFetcherHelper: DhedgeV2PoolTokenFetcherHelper,
  ) { }

  async getPositions() {
    return this.dhedgeV2PoolTokenFetcherHelper.getPositions({ network });
  }
}
