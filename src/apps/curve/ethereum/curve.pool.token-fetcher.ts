import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { AAVE_V2_DEFINITION } from '~apps/aave-v2/aave-v2.definition';
import { COMPOUND_DEFINITION } from '~apps/compound';
import { IRON_BANK_DEFINITION } from '~apps/iron-bank';
import { SYNTHETIX_DEFINITION } from '~apps/synthetix';
import { TOKEMAK_DEFINITION } from '~apps/tokemak/tokemak.definition';
import { YEARN_DEFINITION } from '~apps/yearn/yearn.definition';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurveCryptoFactoryPoolTokenHelper } from '../helpers/curve.crypto-factory-pool.token-helper';
import { CurveCryptoPoolTokenHelper } from '../helpers/curve.crypto-pool.token-helper';
import { CurveStablePoolTokenHelper } from '../helpers/curve.stable-pool.token-helper';
import { CurveOnChainRegistry } from '../helpers/registry/curve.on-chain.registry';

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
    @Inject(CurveCryptoFactoryPoolTokenHelper)
    private readonly curveCryptoFactoryPoolTokenHelper: CurveCryptoFactoryPoolTokenHelper,
    @Inject(CurveOnChainRegistry)
    private readonly curveOnChainRegistry: CurveOnChainRegistry,
  ) {}

  async getPositions() {
    const [stableRegistryBasePools] = await Promise.all([
      this.curveStablePoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: await this.curveOnChainRegistry.getStableSwapRegistryBasePoolDefinitions(network),
        appTokenDependencies: [
          { appId: AAVE_V2_DEFINITION.id, groupIds: [AAVE_V2_DEFINITION.groups.supply.id], network },
          { appId: COMPOUND_DEFINITION.id, groupIds: [COMPOUND_DEFINITION.groups.supply.id], network },
          { appId: SYNTHETIX_DEFINITION.id, groupIds: [SYNTHETIX_DEFINITION.groups.synth.id], network },
          { appId: IRON_BANK_DEFINITION.id, groupIds: [IRON_BANK_DEFINITION.groups.supply.id], network },
          { appId: YEARN_DEFINITION.id, groupIds: [YEARN_DEFINITION.groups.yield.id], network },
          { appId: 'convex', groupIds: ['deposit'], network },
          { appId: 'fixed-forex', groupIds: ['forex'], network },
        ],
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
        poolDefinitions: await this.curveOnChainRegistry.getCryptoSwapRegistryPoolDefinitions(network),
        baseCurveTokens: stableRegistryBasePools,
      }),
      this.curveCryptoPoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: await this.curveOnChainRegistry.getStableSwapFactoryPoolDefinitions(network),
        baseCurveTokens: stableRegistryBasePools,
        appTokenDependencies: [
          { appId: AAVE_V2_DEFINITION.id, groupIds: [AAVE_V2_DEFINITION.groups.supply.id], network },
          { appId: COMPOUND_DEFINITION.id, groupIds: [COMPOUND_DEFINITION.groups.supply.id], network },
          { appId: SYNTHETIX_DEFINITION.id, groupIds: [SYNTHETIX_DEFINITION.groups.synth.id], network },
          { appId: IRON_BANK_DEFINITION.id, groupIds: [IRON_BANK_DEFINITION.groups.supply.id], network },
          { appId: TOKEMAK_DEFINITION.id, groupIds: [TOKEMAK_DEFINITION.groups.reactor.id], network },
          { appId: YEARN_DEFINITION.id, groupIds: [YEARN_DEFINITION.groups.yield.id], network },
          { appId: 'convex', groupIds: ['farm'], network },
          { appId: 'fixed-forex', groupIds: ['forex'], network },
        ],
      }),
      //   this.curveCryptoFactoryPoolTokenHelper.getTokens({
      //     factoryAddress: '0xf18056bbd320e96a48e3fbf8bc061322531aac99',
      //     network,
      //     appId: CURVE_DEFINITION.id,
      //     groupId: CURVE_DEFINITION.groups.pool.id,
      //     baseCurveTokens: stableRegistryBasePools,
      //   }),
    ]);

    return _([stableRegistryBasePools, stableRegistryMetaPools, cryptoRegistryPools, stableFactoryPools])
      .flatten()
      .uniqBy(v => v.address)
      .value();
  }
}
