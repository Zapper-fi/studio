import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CurveChildLiquidityGauge, CurveContractFactory } from '../contracts';
import { CURVE_DEFINITION } from '../curve.definition';
import { CurveChildLiquidityGaugeRewardTokenStrategy } from '../helpers/curve.child-liquidity-gauge.reward-token-strategy';
import { CurveChildLiquidityGaugeRoiStrategy } from '../helpers/curve.child-liquidity-gauge.roi-strategy';
import { CurvePoolTokenDataProps } from '../helpers/curve.pool.token-helper';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.farm.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumCurveFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory)
    private readonly curveContractFactory: CurveContractFactory,
    @Inject(CurveChildLiquidityGaugeRoiStrategy)
    private readonly childGaugeRoiStrategy: CurveChildLiquidityGaugeRoiStrategy,
    @Inject(CurveChildLiquidityGaugeRewardTokenStrategy)
    private readonly childGaugeRewardTokenStrategy: CurveChildLiquidityGaugeRewardTokenStrategy,
  ) {}

  async getPositions() {
    const poolTokens = await this.appToolkit.getAppTokenPositions<CurvePoolTokenDataProps>({
      appId: CURVE_DEFINITION.id,
      groupIds: [CURVE_DEFINITION.groups.pool.id],
      network,
    });

    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<CurveChildLiquidityGauge>(
      {
        network,
        appId,
        groupId,
        dependencies: [{ appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network }],
        resolveImplementation: () => 'child-liquidity-gauge',
        resolveFarmAddresses: () => poolTokens.map(v => v.dataProps.gaugeAddress).filter(v => v !== ZERO_ADDRESS),
        resolveFarmContract: ({ address, network }) =>
          this.curveContractFactory.curveChildLiquidityGauge({ address, network }),
        resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).lp_token(),
        resolveRewardTokenAddresses: this.childGaugeRewardTokenStrategy.build({
          crvTokenAddress: '0x11cdb42b0eb46d95f990bedd4695a6e3fa034978',
        }),
        resolveIsActive: () => true,
        resolveRois: this.childGaugeRoiStrategy.build(),
      },
    );
  }
}
