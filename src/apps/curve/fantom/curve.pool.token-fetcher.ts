import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurveFactoryPoolTokenHelper } from '../helpers/curve.factory-pool.token-helper';
import { CurveV1PoolTokenHelper } from '../helpers/curve.v1-pool.token-helper';
import { CurveV2PoolTokenHelper } from '../helpers/curve.v2-pool.token-helper';

import {
  CURVE_V1_METAPOOL_DEFINITIONS,
  CURVE_V1_POOL_DEFINITIONS,
  CURVE_V2_POOL_DEFINITIONS,
} from './curve.pool.definitions';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.pool.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class FantomCurvePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CurveV1PoolTokenHelper)
    private readonly curveV1PoolTokenHelper: CurveV1PoolTokenHelper,
    @Inject(CurveV2PoolTokenHelper)
    private readonly curveV2PoolTokenHelper: CurveV2PoolTokenHelper,
    @Inject(CurveFactoryPoolTokenHelper)
    private readonly curveFactoryPoolTokenHelper: CurveFactoryPoolTokenHelper,
  ) {}

  async getPositions() {
    const [v1Pools] = await Promise.all([
      this.curveV1PoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: CURVE_V1_POOL_DEFINITIONS,
        statsUrl: 'https://stats.curve.fi/raw-stats-ftm/apys.json',
        appTokenDependencies: [
          // @TODO: Migrate all these :pain:
          {
            network: Network.FANTOM_OPERA_MAINNET,
            appId: 'geist',
            groupIds: ['supply'],
          },
          {
            network: Network.FANTOM_OPERA_MAINNET,
            appId: 'iron-bank',
            groupIds: ['supply'],
          },
        ],
      }),
    ]);

    const [v1Metapools, v2Pools, v2FactoryPools] = await Promise.all([
      this.curveV1PoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: CURVE_V1_METAPOOL_DEFINITIONS,
        statsUrl: 'https://stats.curve.fi/raw-stats-ftm/apys.json',
        baseCurveTokens: v1Pools,
      }),
      this.curveV2PoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: CURVE_V2_POOL_DEFINITIONS,
        baseCurveTokens: v1Pools,
        statsUrl: 'https://stats.curve.fi/raw-stats-ftm/apys.json',
      }),
      this.curveFactoryPoolTokenHelper.getTokens({
        factoryAddress: '0x686d67265703d1f124c45e33d47d794c566889ba',
        network,
        appId,
        groupId,
        baseCurveTokens: v1Pools,
        skipVolume: true,
      }),
    ]);

    return [v1Pools, v1Metapools, v2Pools, v2FactoryPools].flat();
  }
}
