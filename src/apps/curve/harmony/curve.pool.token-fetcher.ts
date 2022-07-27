import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurveCryptoPoolTokenHelper } from '../helpers/curve.crypto-pool.token-helper';
import { CurveStablePoolTokenHelper } from '../helpers/curve.default.token-helper';

import { CURVE_STABLE_POOL_DEFINITIONS, CURVE_CRYPTO_POOL_DEFINITIONS } from './curve.pool.definitions';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.pool.id;
const network = Network.HARMONY_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class HarmonyCurvePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CurveStablePoolTokenHelper)
    private readonly curveStablePoolTokenHelper: CurveStablePoolTokenHelper,
    @Inject(CurveCryptoPoolTokenHelper)
    private readonly curveCryptoPoolTokenHelper: CurveCryptoPoolTokenHelper,
  ) {}

  async getPositions() {
    const [stableBasePools] = await Promise.all([
      this.curveStablePoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: CURVE_STABLE_POOL_DEFINITIONS,
        statsUrl: 'https://stats.curve.fi/raw-stats-harmony/apys.json',
      }),
    ]);

    const [cryptoPools] = await Promise.all([
      this.curveCryptoPoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: CURVE_CRYPTO_POOL_DEFINITIONS,
        baseCurveTokens: stableBasePools,
        statsUrl: 'https://stats.curve.fi/raw-stats-harmony/apys.json',
      }),
    ]);

    return [stableBasePools, cryptoPools].flat();
  }
}
