import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { IRON_BANK_DEFINITION } from '~apps/iron-bank';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurveCryptoPoolTokenHelper } from '../helpers/curve.crypto-pool.token-helper';
import { CurveFactoryPoolTokenHelper } from '../helpers/curve.factory-pool.token-helper';
import { CurveStablePoolTokenHelper } from '../helpers/curve.stable-pool.token-helper';

import {
  CURVE_STABLE_METAPOOL_DEFINITIONS,
  CURVE_STABLE_POOL_DEFINITIONS,
  CURVE_CRYPTO_POOL_DEFINITIONS,
} from './curve.pool.definitions';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.pool.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomCurvePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CurveStablePoolTokenHelper)
    private readonly curveStablePoolTokenHelper: CurveStablePoolTokenHelper,
    @Inject(CurveCryptoPoolTokenHelper)
    private readonly curveCryptoPoolTokenHelper: CurveCryptoPoolTokenHelper,
    @Inject(CurveFactoryPoolTokenHelper)
    private readonly curveFactoryPoolTokenHelper: CurveFactoryPoolTokenHelper,
  ) {}

  async getPositions() {
    const [stableBasePools] = await Promise.all([
      this.curveStablePoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: CURVE_STABLE_POOL_DEFINITIONS,
        statsUrl: 'https://stats.curve.fi/raw-stats-ftm/apys.json',
        appTokenDependencies: [
          {
            network: Network.FANTOM_OPERA_MAINNET,
            appId: 'geist',
            groupIds: ['supply'],
          },
          {
            network: Network.FANTOM_OPERA_MAINNET,
            appId: IRON_BANK_DEFINITION.id,
            groupIds: [IRON_BANK_DEFINITION.groups.supply.id],
          },
        ],
      }),
    ]);

    const [stableMetaPools, cryptoPools, factoryPools] = await Promise.all([
      this.curveStablePoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: CURVE_STABLE_METAPOOL_DEFINITIONS,
        statsUrl: 'https://stats.curve.fi/raw-stats-ftm/apys.json',
        baseCurveTokens: stableBasePools,
      }),
      this.curveCryptoPoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: CURVE_CRYPTO_POOL_DEFINITIONS,
        baseCurveTokens: stableBasePools,
        statsUrl: 'https://stats.curve.fi/raw-stats-ftm/apys.json',
      }),
      this.curveFactoryPoolTokenHelper.getTokens({
        factoryAddress: '0x686d67265703d1f124c45e33d47d794c566889ba',
        network,
        appId,
        groupId,
        baseCurveTokens: stableBasePools,
        skipVolume: true,
      }),
    ]);

    return [stableBasePools, stableMetaPools, cryptoPools, factoryPools].flat();
  }
}
