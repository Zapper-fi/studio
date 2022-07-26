import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CurveChildLiquidityGauge, CurveContractFactory } from '../contracts';
import { CURVE_DEFINITION } from '../curve.definition';
import { CurveChildLiquidityGaugeRewardTokenStrategy } from '../helpers/curve.child-liquidity-gauge.reward-token-strategy';
import { CurveChildLiquidityGaugeRoiStrategy } from '../helpers/curve.child-liquidity-gauge.roi-strategy';
import { CurveOnChainRegistry } from '../helpers/registry/curve.on-chain.registry';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.farm.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheCurveFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory)
    private readonly curveContractFactory: CurveContractFactory,
    @Inject(CurveChildLiquidityGaugeRoiStrategy)
    private readonly childLiquidityGaugeRoiStrategy: CurveChildLiquidityGaugeRoiStrategy,
    @Inject(CurveChildLiquidityGaugeRewardTokenStrategy)
    private readonly childLiquidityGaugeRewardTokenStrategy: CurveChildLiquidityGaugeRewardTokenStrategy,
    @Inject(CurveOnChainRegistry)
    private readonly curveOnChainRegistry: CurveOnChainRegistry,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<CurveChildLiquidityGauge>(
      {
        network,
        appId,
        groupId,
        dependencies: [{ appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network }],
        resolveFarmAddresses: () => this.curveOnChainRegistry.getGaugeAddresses(network),
        resolveFarmContract: ({ address, network }) =>
          this.curveContractFactory.curveChildLiquidityGauge({ address, network }),
        resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).lp_token(),
        resolveRewardTokenAddresses: this.childLiquidityGaugeRewardTokenStrategy.build({
          crvTokenAddress: '0x47536f17f4ff30e64a96a7555826b8f9e66ec468',
        }),
        resolveRois: this.childLiquidityGaugeRoiStrategy.build(),
        resolveIsActive: () => true,
      },
    );
  }
}
