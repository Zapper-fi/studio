import { Inject, Injectable } from '@nestjs/common';
import { groupBy, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Network } from '~types/network.interface';

import {
  CurveChildLiquidityGauge,
  CurveContractFactory,
  CurveController,
  CurveDoubleGauge,
  CurveGauge,
  CurveNGauge,
} from '../../contracts';
import { CURVE_DEFINITION } from '../../curve.definition';
import { CurveChildLiquidityGaugeRoiStrategy } from '../curve.child-liquidity-gauge.roi-strategy';
import { CurveGaugeIsActiveStrategy } from '../curve.gauge.is-active-strategy';
import { CurveGaugeRoiStrategy } from '../curve.gauge.roi-strategy';
import { CurveGaugeDefinition, CurveGaugeType } from '../pool/curve.pool-token.registry';

import { CurveGaugeRegistry } from './curve.gauge.registry';

const CONTROLLER_ADDRESS = '0x2f50d538606fa9edd2b11e2446beb18c9d5846bb';

type CurveDefaultFarmContractPositionHelperParams = {
  network: Network;
  crvTokenAddress: string;
};

type CurveDefaultFarmContractPositionHelperParamsWithGauges = CurveDefaultFarmContractPositionHelperParams & {
  gaugeDefinitions: CurveGaugeDefinition[];
};

@Injectable()
export class CurveDefaultFarmContractPositionHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory)
    private readonly curveContractFactory: CurveContractFactory,
    @Inject(CurveGaugeRoiStrategy)
    private readonly curveGaugeRoiStrategy: CurveGaugeRoiStrategy,
    @Inject(CurveGaugeIsActiveStrategy)
    private readonly curveGaugeIsActiveStrategy: CurveGaugeIsActiveStrategy,
    @Inject(CurveChildLiquidityGaugeRoiStrategy)
    private readonly curveChildLiquidityGaugeRoiStrategy: CurveChildLiquidityGaugeRoiStrategy,
    @Inject(CurveGaugeRegistry)
    private readonly curveGaugeRegistry: CurveGaugeRegistry,
  ) {}

  async getPositions(params: CurveDefaultFarmContractPositionHelperParams) {
    const gaugeDefinitions = await this.curveGaugeRegistry.getGaugesWithType(params.network);

    if (params.network !== Network.ETHEREUM_MAINNET) {
      return this.getChildLiquidityGaugeContractPositions({ ...params, gaugeDefinitions });
    }

    const grouped = groupBy(gaugeDefinitions, v => v.version);

    return Promise.all([
      this.getSingleGaugeContractPositions({ ...params, gaugeDefinitions: grouped[CurveGaugeType.SINGLE] }),
      this.getDoubleGaugeContractPositions({ ...params, gaugeDefinitions: grouped[CurveGaugeType.DOUBLE] }),
      this.getNGaugeContractPositions({ ...params, gaugeDefinitions: grouped[CurveGaugeType.N_GAUGE] }),
      this.getGaugeV4ContractPositions({ ...params, gaugeDefinitions: grouped[CurveGaugeType.GAUGE_V4] }),
    ]).then(v => v.flat());
  }

  private async getSingleGaugeContractPositions({
    network,
    crvTokenAddress,
    gaugeDefinitions,
  }: CurveDefaultFarmContractPositionHelperParamsWithGauges) {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<CurveGauge>({
      network,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.farm.id,
      dependencies: [{ appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network }],
      resolveFarmAddresses: async () => gaugeDefinitions.map(v => v.swapAddress),
      resolveImplementation: () => CurveGaugeType.SINGLE,
      resolveFarmContract: ({ address, network }) => this.curveContractFactory.curveGauge({ address, network }),
      resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).lp_token(),
      resolveRewardTokenAddresses: async () => [crvTokenAddress],
      resolveIsActive: this.curveGaugeIsActiveStrategy.build({
        resolveInflationRate: ({ contract, multicall }) => multicall.wrap(contract).inflation_rate(),
      }),
      resolveRois: this.curveGaugeRoiStrategy.build<CurveGauge, CurveController>({
        resolveControllerContract: ({ network }) =>
          this.curveContractFactory.curveController({ address: CONTROLLER_ADDRESS, network }),
        resolveInflationRate: ({ gaugeContract, multicall }) => multicall.wrap(gaugeContract).inflation_rate(),
        resolveWorkingSupply: ({ gaugeContract, multicall }) => multicall.wrap(gaugeContract).working_supply(),
        resolveRelativeWeight: ({ controllerContract, multicall, address }) =>
          multicall.wrap(controllerContract)['gauge_relative_weight(address)'](address),
      }),
    });
  }

  private async getDoubleGaugeContractPositions({
    network,
    crvTokenAddress,
    gaugeDefinitions,
  }: CurveDefaultFarmContractPositionHelperParamsWithGauges) {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<CurveDoubleGauge>({
      network,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.farm.id,
      dependencies: [{ appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network }],
      resolveFarmAddresses: async () => gaugeDefinitions.map(v => v.swapAddress),
      resolveImplementation: () => CurveGaugeType.DOUBLE,
      resolveFarmContract: ({ address, network }) => this.curveContractFactory.curveDoubleGauge({ address, network }),
      resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).lp_token(),
      resolveLiquidity: ({ contract, multicall }) => multicall.wrap(contract).totalSupply(),
      resolveRewardTokenAddresses: async ({ contract, multicall }) => {
        const bonusRewardTokenAddress = await multicall.wrap(contract).rewarded_token();
        return [crvTokenAddress, bonusRewardTokenAddress].filter(v => v !== ZERO_ADDRESS);
      },
      resolveIsActive: this.curveGaugeIsActiveStrategy.build({
        resolveInflationRate: ({ contract, multicall }) => multicall.wrap(contract).inflation_rate(),
      }),
      resolveRois: this.curveGaugeRoiStrategy.build<CurveDoubleGauge, CurveController>({
        resolveControllerContract: ({ network }) =>
          this.curveContractFactory.curveController({ address: CONTROLLER_ADDRESS, network }),
        resolveInflationRate: ({ gaugeContract, multicall }) => multicall.wrap(gaugeContract).inflation_rate(),
        resolveWorkingSupply: ({ gaugeContract, multicall }) => multicall.wrap(gaugeContract).working_supply(),
        resolveRelativeWeight: ({ controllerContract, multicall, address }) =>
          multicall.wrap(controllerContract)['gauge_relative_weight(address)'](address),
      }),
    });
  }

  private async getNGaugeContractPositions({
    network,
    crvTokenAddress,
    gaugeDefinitions,
  }: CurveDefaultFarmContractPositionHelperParamsWithGauges) {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<CurveNGauge>({
      network,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.farm.id,
      dependencies: [{ appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network }],
      resolveFarmAddresses: async () => gaugeDefinitions.map(v => v.swapAddress),
      resolveImplementation: () => CurveGaugeType.N_GAUGE,
      resolveLiquidity: ({ contract, multicall }) => multicall.wrap(contract).totalSupply(),
      resolveFarmContract: ({ address, network }) => this.curveContractFactory.curveNGauge({ address, network }),
      resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).lp_token(),
      resolveRewardTokenAddresses: async ({ contract, multicall }) => {
        const bonusRewardTokenAddress = await multicall.wrap(contract).reward_tokens(0);
        return [crvTokenAddress, bonusRewardTokenAddress].filter(v => v !== ZERO_ADDRESS);
      },
      resolveIsActive: this.curveGaugeIsActiveStrategy.build({
        resolveInflationRate: ({ contract, multicall }) => multicall.wrap(contract).inflation_rate(),
      }),
      resolveRois: this.curveGaugeRoiStrategy.build<CurveNGauge, CurveController>({
        resolveControllerContract: ({ network }) =>
          this.curveContractFactory.curveController({ address: CONTROLLER_ADDRESS, network }),
        resolveInflationRate: ({ gaugeContract, multicall }) => multicall.wrap(gaugeContract).inflation_rate(),
        resolveWorkingSupply: ({ gaugeContract, multicall }) => multicall.wrap(gaugeContract).working_supply(),
        resolveRelativeWeight: ({ controllerContract, multicall, address }) =>
          multicall.wrap(controllerContract)['gauge_relative_weight(address)'](address),
      }),
    });
  }

  private async getGaugeV4ContractPositions({
    network,
    crvTokenAddress,
    gaugeDefinitions,
  }: CurveDefaultFarmContractPositionHelperParamsWithGauges) {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<CurveNGauge>({
      network,
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.farm.id,
      dependencies: [{ appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network }],
      resolveFarmAddresses: async () => gaugeDefinitions.map(v => v.swapAddress),
      resolveImplementation: () => CurveGaugeType.GAUGE_V4,
      resolveLiquidity: ({ contract, multicall }) => multicall.wrap(contract).totalSupply(),
      resolveFarmContract: ({ address, network }) => this.curveContractFactory.curveNGauge({ address, network }),
      resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).lp_token(),
      resolveRewardTokenAddresses: async ({ contract, multicall }) => {
        const bonusRewardTokenAddress = await multicall.wrap(contract).reward_tokens(0);
        return [crvTokenAddress, bonusRewardTokenAddress].filter(v => v !== ZERO_ADDRESS);
      },
      resolveIsActive: this.curveGaugeIsActiveStrategy.build({
        resolveInflationRate: ({ contract, multicall }) => multicall.wrap(contract).inflation_rate(),
      }),
      resolveRois: this.curveGaugeRoiStrategy.build<CurveNGauge, CurveController>({
        resolveControllerContract: ({ network }) =>
          this.curveContractFactory.curveController({ address: CONTROLLER_ADDRESS, network }),
        resolveInflationRate: ({ gaugeContract, multicall }) => multicall.wrap(gaugeContract).inflation_rate(),
        resolveWorkingSupply: ({ gaugeContract, multicall }) => multicall.wrap(gaugeContract).working_supply(),
        resolveRelativeWeight: ({ controllerContract, multicall, address }) =>
          multicall.wrap(controllerContract)['gauge_relative_weight(address)'](address),
      }),
    });
  }

  private async getChildLiquidityGaugeContractPositions({
    network,
    crvTokenAddress,
    gaugeDefinitions,
  }: CurveDefaultFarmContractPositionHelperParamsWithGauges) {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<CurveChildLiquidityGauge>(
      {
        network,
        appId: CURVE_DEFINITION.id,
        groupId: CURVE_DEFINITION.groups.farm.id,
        dependencies: [{ appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network }],
        resolveFarmAddresses: async () => gaugeDefinitions.map(v => v.swapAddress),
        resolveFarmContract: ({ address, network }) =>
          this.curveContractFactory.curveChildLiquidityGauge({ address, network }),
        resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).lp_token(),
        resolveRewardTokenAddresses: async ({ contract, multicall }) => {
          const wrapped = multicall.wrap(contract);
          const rewardTokenAddresses = await Promise.all(range(0, 4).map(async i => wrapped.reward_tokens(i)));
          return [crvTokenAddress, ...rewardTokenAddresses.map(v => v.toLowerCase()).filter(v => v !== ZERO_ADDRESS)];
        },
        resolveRois: this.curveChildLiquidityGaugeRoiStrategy.build(),
        resolveIsActive: () => true,
      },
    );
  }
}
