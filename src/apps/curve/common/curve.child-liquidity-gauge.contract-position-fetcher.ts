import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { isClaimable } from '~position/position.utils';
import {
  DataPropsStageParams,
  GetTokenBalancesPerPositionParams,
} from '~position/template/contract-position.template.position-fetcher';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDynamicTemplateContractPositionFetcher,
} from '~position/template/single-staking.dynamic.template.contract-position-fetcher';

import { CurveChildLiquidityGauge, CurveContractFactory } from '../contracts';
import { CurveGaugeType } from '../curve.types';
import { CurveGaugeRegistry } from '../helpers/curve.gauge.registry';

export abstract class CurveChildLiquidityGaugeContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<CurveChildLiquidityGauge> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) protected readonly contractFactory: CurveContractFactory,
    @Inject(CurveGaugeRegistry) protected readonly curveGaugeRegistry: CurveGaugeRegistry,
  ) {
    super(appToolkit);
  }

  getContract(address: string): CurveChildLiquidityGauge {
    return this.contractFactory.curveChildLiquidityGauge({ address, network: this.network });
  }

  async getFarmAddresses() {
    const allGauges = await this.curveGaugeRegistry.getGaugeDefinitions(this.network);
    return allGauges.filter(v => v.gaugeType === CurveGaugeType.CHILD).map(v => v.gaugeAddress);
  }

  async getStakedTokenAddress(contract: CurveChildLiquidityGauge) {
    return contract.lp_token();
  }

  async getRewardTokenAddresses(contract: CurveChildLiquidityGauge) {
    const rewardTokenAddresses = await Promise.all(range(0, 4).map(async i => contract.reward_tokens(i)));
    return rewardTokenAddresses.map(v => v.toLowerCase()).filter(v => v !== ZERO_ADDRESS);
  }

  async getRewardRates({
    contractPosition,
    multicall,
  }: DataPropsStageParams<CurveChildLiquidityGauge, SingleStakingFarmDataProps>) {
    // Calculate rate of CRV rewards
    const gaugeContract = this.contractFactory.curveChildLiquidityGauge(contractPosition);
    const period = await multicall.wrap(gaugeContract).period();
    const periodTimestamp = await multicall.wrap(gaugeContract).period_timestamp(period);
    const periodWeek = Math.floor(periodTimestamp.toNumber() / (86_400 * 7)); // num weeks
    const inflationRate = await multicall.wrap(gaugeContract).inflation_rate(periodWeek);

    // Calculate rate of bonus rewards
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    const rewardTokenCount = await multicall.wrap(gaugeContract).reward_count();
    const rewardTokenRates = await Promise.all(
      range(0, Number(rewardTokenCount)).map(async index => {
        const rewardTokenAddressRaw = await multicall.wrap(gaugeContract).reward_tokens(index);
        const rewardTokenAddress = rewardTokenAddressRaw.toLowerCase();
        const rewardToken = rewardTokens.find(p => p.address === rewardTokenAddress);
        if (!rewardToken) return 0;

        const rewardData = await multicall.wrap(gaugeContract).reward_data(rewardTokenAddress);
        if (Number(rewardData.period_finish) < Date.now() / 1000) return 0;

        return rewardData.rate;
      }),
    );

    return [inflationRate, ...rewardTokenRates];
  }

  getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesPerPositionParams<CurveChildLiquidityGauge, SingleStakingFarmDataProps>): Promise<BigNumberish> {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesPerPositionParams<CurveChildLiquidityGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(v => contract.claimable_reward(address, v.address)));
  }
}
