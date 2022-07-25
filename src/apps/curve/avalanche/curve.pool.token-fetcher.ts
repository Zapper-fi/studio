import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { AAVE_V2_DEFINITION } from '~apps/aave-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurveCryptoPoolTokenHelper } from '../helpers/curve.crypto-pool.token-helper';
import { CurveFactoryPoolTokenHelper } from '../helpers/curve.factory-pool.token-helper';
import { CurveStablePoolTokenHelper } from '../helpers/curve.stable-pool.token-helper';

import { CURVE_STABLE_POOL_DEFINITIONS, CURVE_CRYPTO_POOL_DEFINITIONS } from './curve.pool.definitions';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.pool.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheCurvePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CurveStablePoolTokenHelper)
    private readonly curveStablePoolTokenHelper: CurveStablePoolTokenHelper,
    @Inject(CurveCryptoPoolTokenHelper)
    private readonly curveCryptoPoolTokenHelper: CurveCryptoPoolTokenHelper,
    @Inject(CurveFactoryPoolTokenHelper)
    private readonly curveFactoryPoolTokenHelper: CurveFactoryPoolTokenHelper,
  ) {}

  async getPositions() {
    const [v1Pools] = await Promise.all([
      this.curveStablePoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: CURVE_STABLE_POOL_DEFINITIONS,
        statsUrl: 'https://stats.curve.fi/raw-stats-avalanche/apys.json',
        appTokenDependencies: [
          { appId: AAVE_V2_DEFINITION.id, groupIds: [AAVE_V2_DEFINITION.groups.supply.id], network },
        ],
      }),
    ]);

    const [cryptoPools, factoryPools] = await Promise.all([
      this.curveCryptoPoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: CURVE_CRYPTO_POOL_DEFINITIONS,
        baseCurveTokens: v1Pools,
        statsUrl: 'https://stats.curve.fi/raw-stats-avalanche/apys.json',
        appTokenDependencies: [
          { appId: AAVE_V2_DEFINITION.id, groupIds: [AAVE_V2_DEFINITION.groups.supply.id], network },
        ],
      }),
      this.curveFactoryPoolTokenHelper.getTokens({
        factoryAddress: '0xb17b674d9c5cb2e441f8e196a2f048a81355d031',
        network,
        appId,
        groupId,
        baseCurveTokens: v1Pools,
        skipVolume: true, // BlockService is only supported on ETHEREUM_MAINNET.
      }),
    ]);

    return [v1Pools, cryptoPools, factoryPools].flat();
  }
}
