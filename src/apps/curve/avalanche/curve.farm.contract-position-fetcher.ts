import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CurveChildLiquidityGauge, CurveContractFactory, CurveRewardsOnlyGauge } from '../contracts';
import { CURVE_DEFINITION } from '../curve.definition';
import { CurveChildLiquidityGaugeFactoryAddressHelper } from '../helpers/curve.child-liquidity-gauge-factory.address-helper';
import { CurveChildLiquidityGaugeRewardTokenStrategy } from '../helpers/curve.child-liquidity-gauge.reward-token-strategy';
import { CurveChildLiquidityGaugeRoiStrategy } from '../helpers/curve.child-liquidity-gauge.roi-strategy';
import { CurveRewardsOnlyGaugeRewardTokenStrategy } from '../helpers/curve.rewards-only-gauge.reward-token-strategy';
import { CurveRewardsOnlyGaugeRoiStrategy } from '../helpers/curve.rewards-only-gauge.roi-strategy';

import { CURVE_V1_POOL_DEFINITIONS, CURVE_V2_POOL_DEFINITIONS } from './curve.pool.definitions';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.farm.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheCurveFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory)
    private readonly curveContractFactory: CurveContractFactory,
    @Inject(CurveRewardsOnlyGaugeRoiStrategy)
    private readonly curveRewardsOnlyGaugeRoiStrategy: CurveRewardsOnlyGaugeRoiStrategy,
    @Inject(CurveRewardsOnlyGaugeRewardTokenStrategy)
    private readonly curveRewardsOnlyGaugeRewardTokenStrategy: CurveRewardsOnlyGaugeRewardTokenStrategy,
    @Inject(CurveChildLiquidityGaugeFactoryAddressHelper)
    private readonly childGaugeAddressHelper: CurveChildLiquidityGaugeFactoryAddressHelper,
    @Inject(CurveChildLiquidityGaugeRoiStrategy)
    private readonly childGaugeRoiStrategy: CurveChildLiquidityGaugeRoiStrategy,
    @Inject(CurveChildLiquidityGaugeRewardTokenStrategy)
    private readonly childGaugeRewardTokenStrategy: CurveChildLiquidityGaugeRewardTokenStrategy,
  ) {}

  async getRewardsOnlyGaugePositions() {
    const definitions = [CURVE_V1_POOL_DEFINITIONS, CURVE_V2_POOL_DEFINITIONS].flat().filter(v => !!v.gaugeAddress);

    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<CurveRewardsOnlyGauge>({
      network,
      appId,
      groupId,
      dependencies: [{ appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network }],
      resolveImplementation: () => 'rewards-only-gauge',
      resolveFarmAddresses: () => definitions.map(v => v.gaugeAddress!),
      resolveFarmContract: ({ address, network }) =>
        this.curveContractFactory.curveRewardsOnlyGauge({ address, network }),
      resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).lp_token(),
      resolveRewardTokenAddresses: this.curveRewardsOnlyGaugeRewardTokenStrategy.build(),
      resolveRois: this.curveRewardsOnlyGaugeRoiStrategy.build({ tokenDefinitions: definitions }),
      resolveIsActive: () => true,
    });
  }

  async getChildLiquidityGaugePositions() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<CurveChildLiquidityGauge>(
      {
        network,
        appId,
        groupId,
        dependencies: [{ appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network }],
        resolveImplementation: () => 'child-liquidity-gauge',
        resolveFarmAddresses: () =>
          this.childGaugeAddressHelper.getGaugeAddresses({
            factoryAddress: '0xabc000d88f23bb45525e447528dbf656a9d55bf5',
            network,
          }),
        resolveFarmContract: ({ address, network }) =>
          this.curveContractFactory.curveChildLiquidityGauge({ address, network }),
        resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).lp_token(),
        resolveRewardTokenAddresses: this.childGaugeRewardTokenStrategy.build({
          crvTokenAddress: '0x47536f17f4ff30e64a96a7555826b8f9e66ec468',
        }),
        resolveRois: this.childGaugeRoiStrategy.build(),
        resolveIsActive: () => true,
      },
    );
  }

  async getPositions() {
    const [rewardOnlyGaugePositions, childLiquidityGaugePositions] = await Promise.all([
      this.getRewardsOnlyGaugePositions(),
      this.getChildLiquidityGaugePositions(),
    ]);

    return [...rewardOnlyGaugePositions, ...childLiquidityGaugePositions];
  }
}
