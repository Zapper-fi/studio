import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { SingleStakingFarmContractPositionHelper } from '~app-toolkit';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CurveContractFactory, CurveGaugeV2, CurveNGauge } from '../contracts';
import { CURVE_DEFINITION } from '../curve.definition';
import { CurveFactoryGaugeAddressHelper } from '../helpers/curve.factory-gauge.address-helper';
import { CurveGaugeV2RewardTokenStrategy } from '../helpers/curve.gauge-v2.reward-token-strategy';
import { CurveGaugeV2RoiStrategy } from '../helpers/curve.gauge-v2.roi-strategy';
import { CurveGaugeIsActiveStrategy } from '../helpers/curve.gauge.is-active-strategy';

import { CURVE_V1_POOL_DEFINITIONS } from './curve.pool.definitions';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.farm.id;
const network = Network.OPTIMISM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismCurveFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(SingleStakingFarmContractPositionHelper)
    private readonly singleStakingFarmContractPositionHelper: SingleStakingFarmContractPositionHelper,
    @Inject(CurveContractFactory)
    private readonly curveContractFactory: CurveContractFactory,
    @Inject(CurveGaugeV2RoiStrategy)
    private readonly curveGaugeV2RoiStrategy: CurveGaugeV2RoiStrategy,
    @Inject(CurveGaugeV2RewardTokenStrategy)
    private readonly curveGaugeV2RewardTokenStrategy: CurveGaugeV2RewardTokenStrategy,
    @Inject(CurveFactoryGaugeAddressHelper)
    private readonly curveFactoryGaugeAddressHelper: CurveFactoryGaugeAddressHelper,
    @Inject(CurveGaugeIsActiveStrategy)
    private readonly curveGaugeIsActiveStrategy: CurveGaugeIsActiveStrategy,
  ) {}

  private async getNGaugeFarms() {
    return this.singleStakingFarmContractPositionHelper.getContractPositions<CurveNGauge>({
      network,
      appId,
      groupId,
      dependencies: [{ appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network }],
      resolveFarmAddresses: async () => {
        return await this.curveFactoryGaugeAddressHelper.getGaugeAddresses({
          factoryAddress: '0x2db0e83599a91b508ac268a6197b8b14f5e72840',
          network,
        });
      },
      resolveImplementation: () => 'n-gauge',
      resolveTotalValueLocked: ({ contract, multicall }) => multicall.wrap(contract).totalSupply(),
      resolveFarmContract: ({ address, network }) => this.curveContractFactory.curveNGauge({ address, network }),
      resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).lp_token(),
      resolveRewardTokenAddresses: async ({ contract, multicall }) => {
        const bonusRewardTokenAddress = await multicall.wrap(contract).reward_tokens(0);
        return [bonusRewardTokenAddress].filter(v => v !== ZERO_ADDRESS);
      },
      resolveIsActive: this.curveGaugeIsActiveStrategy.build({
        resolveInflationRate: ({ contract, multicall }) => multicall.wrap(contract).inflation_rate(),
      }),
      resolveRois: async () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }

  async getSingleGaugeFarms() {
    const definitions = [CURVE_V1_POOL_DEFINITIONS].flat().filter(v => !!v.gaugeAddress);
    return this.singleStakingFarmContractPositionHelper.getContractPositions<CurveGaugeV2>({
      network,
      appId,
      groupId,
      dependencies: [{ appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network }],
      resolveFarmAddresses: () => compact(definitions.map(v => v.gaugeAddress)),
      resolveFarmContract: ({ address, network }) => this.curveContractFactory.curveGaugeV2({ address, network }),
      resolveStakedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).lp_token(),
      resolveRewardTokenAddresses: this.curveGaugeV2RewardTokenStrategy.build(),
      resolveIsActive: () => true,
      resolveRois: this.curveGaugeV2RoiStrategy.build({
        tokenDefinitions: definitions,
      }),
    });
  }

  async getPositions() {
    return Promise.all([this.getSingleGaugeFarms(), this.getNGaugeFarms()]).then(v => v.flat());
  }
}
