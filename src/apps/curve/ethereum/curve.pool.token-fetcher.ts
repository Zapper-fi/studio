import { Inject } from '@nestjs/common';
import { compact, uniqBy } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { AAVE_V2_DEFINITION } from '~apps/aave-v2/aave-v2.definition';
import { COMPOUND_DEFINITION } from '~apps/compound';
import { IRON_BANK_DEFINITION } from '~apps/iron-bank';
import { SYNTHETIX_DEFINITION } from '~apps/synthetix';
import { TOKEMAK_DEFINITION } from '~apps/tokemak';
import { YEARN_DEFINITION } from '~apps/yearn/yearn.definition';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurveCryptoFactoryPoolTokenHelper } from '../helpers/curve.crypto-factory-pool.token-helper';
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
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumCurvePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CurveStablePoolTokenHelper)
    private readonly curveStablePoolTokenHelper: CurveStablePoolTokenHelper,
    @Inject(CurveCryptoPoolTokenHelper)
    private readonly curveCryptoPoolTokenHelper: CurveCryptoPoolTokenHelper,
    @Inject(CurveFactoryPoolTokenHelper)
    private readonly curveFactoryPoolTokenHelper: CurveFactoryPoolTokenHelper,
    @Inject(CurveCryptoFactoryPoolTokenHelper)
    private readonly curveCryptoFactoryPoolTokenHelper: CurveCryptoFactoryPoolTokenHelper,
  ) {}

  async getPositions() {
    const [stableBasePools] = await Promise.all([
      this.curveStablePoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: CURVE_STABLE_POOL_DEFINITIONS,
        statsUrl: 'https://stats.curve.fi/raw-stats/apys.json',
        appTokenDependencies: [
          { appId: AAVE_V2_DEFINITION.id, groupIds: [AAVE_V2_DEFINITION.groups.supply.id], network },
          { appId: COMPOUND_DEFINITION.id, groupIds: [COMPOUND_DEFINITION.groups.supply.id], network },
          { appId: IRON_BANK_DEFINITION.id, groupIds: [IRON_BANK_DEFINITION.groups.supply.id], network },
          { appId: YEARN_DEFINITION.id, groupIds: [YEARN_DEFINITION.groups.yield.id], network },
          { appId: 'convex', groupIds: ['deposit'], network },
          { appId: 'fixed-forex', groupIds: ['forex'], network },
        ],
      }),
    ]);

    const [stableMetaPools, cryptoPools, v1FactoryPools, v2FactoryPools, cryptoFactoryPools] = await Promise.all([
      this.curveStablePoolTokenHelper.getTokens({
        network,
        appId,
        groupId: CURVE_DEFINITION.groups.pool.id,
        baseCurveTokens: stableBasePools,
        poolDefinitions: CURVE_STABLE_METAPOOL_DEFINITIONS,
        statsUrl: 'https://stats.curve.fi/raw-stats/apys.json',
      }),
      this.curveCryptoPoolTokenHelper.getTokens({
        network,
        appId: CURVE_DEFINITION.id,
        groupId: CURVE_DEFINITION.groups.pool.id,
        baseCurveTokens: stableBasePools,
        poolDefinitions: CURVE_CRYPTO_POOL_DEFINITIONS,
        statsUrl: 'https://stats.curve.fi/raw-stats-crypto/apys.json',
      }),
      this.curveFactoryPoolTokenHelper.getTokens({
        factoryAddress: '0x0959158b6040d32d04c301a72cbfd6b39e21c9ae',
        network,
        appId: CURVE_DEFINITION.id,
        groupId: CURVE_DEFINITION.groups.pool.id,
        baseCurveTokens: stableBasePools,
      }),
      this.curveFactoryPoolTokenHelper.getTokens({
        factoryAddress: '0xb9fc157394af804a3578134a6585c0dc9cc990d4',
        network,
        appId: CURVE_DEFINITION.id,
        groupId: CURVE_DEFINITION.groups.pool.id,
        baseCurveTokens: stableBasePools,
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
          {
            appId: YEARN_DEFINITION.id,
            groupIds: [YEARN_DEFINITION.groups.v1Vault.id, YEARN_DEFINITION.groups.v2Vault.id],
            network,
          },
          { appId: TOKEMAK_DEFINITION.id, groupIds: [TOKEMAK_DEFINITION.groups.reactor.id], network },
        ],
      }),
      this.curveCryptoFactoryPoolTokenHelper.getTokens({
        factoryAddress: '0xf18056bbd320e96a48e3fbf8bc061322531aac99',
        network,
        appId: CURVE_DEFINITION.id,
        groupId: CURVE_DEFINITION.groups.pool.id,
        baseCurveTokens: stableBasePools,
      }),
    ]);

    const tokens = compact(
      [stableBasePools, stableMetaPools, cryptoPools, v1FactoryPools, v2FactoryPools, cryptoFactoryPools].flat(),
    );
    return uniqBy(tokens, v => v.address);
  }
}
