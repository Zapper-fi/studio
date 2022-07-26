import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { AAVE_V2_DEFINITION } from '~apps/aave-v2/aave-v2.definition';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurveCryptoPoolTokenHelper } from '../helpers/curve.crypto-pool.token-helper';
import { CurveStablePoolTokenHelper } from '../helpers/curve.stable-pool.token-helper';
import { CurveOnChainRegistry } from '../helpers/registry/curve.on-chain.registry';

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
    @Inject(CurveOnChainRegistry)
    private readonly curveOnChainRegistry: CurveOnChainRegistry,
  ) {}

  async getPositions() {
    const [stableRegistryBasePools] = await Promise.all([
      this.curveStablePoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        appTokenDependencies: [
          { appId: AAVE_V2_DEFINITION.id, groupIds: [AAVE_V2_DEFINITION.groups.supply.id], network },
        ],
        poolDefinitions: await this.curveOnChainRegistry.getStableSwapRegistryBasePoolDefinitions(network),
      }),
    ]);

    const [stableRegistryMetaPools, cryptoRegistryPools, stableFactoryPools] = await Promise.all([
      this.curveStablePoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: await this.curveOnChainRegistry.getStableSwapRegistryMetaPoolDefinitions(network),
        baseCurveTokens: stableRegistryBasePools,
      }),
      this.curveCryptoPoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        appTokenDependencies: [
          { appId: AAVE_V2_DEFINITION.id, groupIds: [AAVE_V2_DEFINITION.groups.supply.id], network },
        ],
        poolDefinitions: await this.curveOnChainRegistry.getCryptoSwapRegistryPoolDefinitions(network),
        baseCurveTokens: stableRegistryBasePools,
      }),
      this.curveStablePoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: await this.curveOnChainRegistry.getStableSwapFactoryPoolDefinitions(network),
        baseCurveTokens: stableRegistryBasePools,
      }),
    ]);

    return _([stableRegistryBasePools, stableRegistryMetaPools, cryptoRegistryPools, stableFactoryPools])
      .flatten()
      .uniqBy(v => v.address)
      .value();
  }
}
