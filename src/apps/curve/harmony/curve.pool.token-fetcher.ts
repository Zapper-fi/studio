import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurveV1PoolTokenHelper } from '../helpers/curve.v1-pool.token-helper';
import { CurveV2PoolTokenHelper } from '../helpers/curve.v2-pool.token-helper';

import { CURVE_V1_POOL_DEFINITIONS, CURVE_V2_POOL_DEFINITIONS } from './curve.pool.definitions';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.pool.id;
const network = Network.HARMONY_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class HarmonyCurvePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CurveV1PoolTokenHelper)
    private readonly curveV1PoolTokenHelper: CurveV1PoolTokenHelper,
    @Inject(CurveV2PoolTokenHelper)
    private readonly curveV2PoolTokenHelper: CurveV2PoolTokenHelper,
  ) {}

  async getPositions() {
    const [v1Pools] = await Promise.all([
      this.curveV1PoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: CURVE_V1_POOL_DEFINITIONS,
        statsUrl: 'https://stats.curve.fi/raw-stats-harmony/apys.json',
      }),
    ]);

    const [v2Pools] = await Promise.all([
      this.curveV2PoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: CURVE_V2_POOL_DEFINITIONS,
        baseCurveTokens: v1Pools,
        statsUrl: 'https://stats.curve.fi/raw-stats-harmony/apys.json',
      }),
    ]);

    return [v1Pools, v2Pools].flat();
  }
}
