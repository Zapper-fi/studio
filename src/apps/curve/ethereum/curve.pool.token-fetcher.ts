import { Inject } from '@nestjs/common';
import { compact, uniqBy } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { SYNTHETIX_DEFINITION } from '~apps/synthetix';
import { TOKEMAK_DEFINITION } from '~apps/tokemak';
import { YEARN_DEFINITION } from '~apps/yearn/yearn.definition';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurveCryptoFactoryPoolTokenHelper } from '../helpers/curve.crypto-factory-pool.token-helper';
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
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumCurvePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CurveV1PoolTokenHelper)
    private readonly curveV1PoolTokenHelper: CurveV1PoolTokenHelper,
    @Inject(CurveV2PoolTokenHelper)
    private readonly curveV2PoolTokenHelper: CurveV2PoolTokenHelper,
    @Inject(CurveFactoryPoolTokenHelper)
    private readonly curveFactoryPoolTokenHelper: CurveFactoryPoolTokenHelper,
    @Inject(CurveCryptoFactoryPoolTokenHelper)
    private readonly curveCryptoFactoryPoolTokenHelper: CurveCryptoFactoryPoolTokenHelper,
  ) {}

  async getPositions() {
    const [v1Pools] = await Promise.all([
      this.curveV1PoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: CURVE_V1_POOL_DEFINITIONS,
        statsUrl: 'https://stats.curve.fi/raw-stats/apys.json',
        appTokenDependencies: [
          // @TODO: Migrate all these :pain:
          { appId: 'aave-v2', groupIds: ['supply'], network },
          { appId: 'compound', groupIds: ['supply'], network },
          { appId: 'iron-bank', groupIds: ['supply'], network },
          { appId: YEARN_DEFINITION.id, groupIds: [YEARN_DEFINITION.groups.yield.id], network },
          { appId: 'convex', groupIds: ['deposit'], network },
        ],
      }),
    ]);

    const [v1MetaPools, v2Pools, v1FactoryPools, v2FactoryPools, cryptoFactoryPools] = await Promise.all([
      this.curveV1PoolTokenHelper.getTokens({
        network,
        appId,
        groupId: CURVE_DEFINITION.groups.pool.id,
        baseCurveTokens: v1Pools,
        poolDefinitions: CURVE_V1_METAPOOL_DEFINITIONS,
        statsUrl: 'https://stats.curve.fi/raw-stats/apys.json',
      }),
      this.curveV2PoolTokenHelper.getTokens({
        network,
        appId: CURVE_DEFINITION.id,
        groupId: CURVE_DEFINITION.groups.pool.id,
        baseCurveTokens: v1Pools,
        poolDefinitions: CURVE_V2_POOL_DEFINITIONS,
        statsUrl: 'https://stats.curve.fi/raw-stats-crypto/apys.json',
      }),
      this.curveFactoryPoolTokenHelper.getTokens({
        factoryAddress: '0x0959158b6040d32d04c301a72cbfd6b39e21c9ae',
        network,
        appId: CURVE_DEFINITION.id,
        groupId: CURVE_DEFINITION.groups.pool.id,
        baseCurveTokens: v1Pools,
      }),
      this.curveFactoryPoolTokenHelper.getTokens({
        factoryAddress: '0xb9fc157394af804a3578134a6585c0dc9cc990d4',
        network,
        appId: CURVE_DEFINITION.id,
        groupId: CURVE_DEFINITION.groups.pool.id,
        baseCurveTokens: v1Pools,
        appTokenDependencies: [
          // @TODO: Migrate all these :pain:
          { appId: 'aave-v2', groupIds: ['supply'], network },
          { appId: 'compound', groupIds: ['supply'], network },
          { appId: 'iron-bank', groupIds: ['supply'], network },
          {
            appId: SYNTHETIX_DEFINITION.id,
            groupIds: [SYNTHETIX_DEFINITION.groups.farm.id, SYNTHETIX_DEFINITION.groups.synth.id],
            network,
          },
          { appId: 'convex', groupIds: ['farm'], network },
          { appId: YEARN_DEFINITION.id, groupIds: [YEARN_DEFINITION.groups.vault.id], network },
          { appId: TOKEMAK_DEFINITION.id, groupIds: [TOKEMAK_DEFINITION.groups.reactor.id], network },
        ],
      }),
      this.curveCryptoFactoryPoolTokenHelper.getTokens({
        factoryAddress: '0xf18056bbd320e96a48e3fbf8bc061322531aac99',
        network,
        appId: CURVE_DEFINITION.id,
        groupId: CURVE_DEFINITION.groups.pool.id,
        baseCurveTokens: v1Pools,
      }),
    ]);

    const tokens = compact([v1Pools, v1MetaPools, v2Pools, v1FactoryPools, v2FactoryPools, cryptoFactoryPools].flat());
    return uniqBy(tokens, v => v.address);
  }
}
