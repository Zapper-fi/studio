import { Inject, Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { range, sum } from 'lodash';

import { SingleStakingFarmContractPositionHelperParams } from '~app-toolkit';

import { CurveChildLiquidityGauge, CurveContractFactory } from '../contracts';

@Injectable()
export class CurveChildLiquidityGaugeRoiStrategy {
  constructor(
    @Inject(CurveContractFactory)
    private readonly curveContractFactory: CurveContractFactory,
  ) {}

  build(): SingleStakingFarmContractPositionHelperParams<CurveChildLiquidityGauge>['resolveRois'] {
    return async ({ multicall, address, stakedToken, rewardTokens, network }) => {
      // Get the TVL of the pool to calculate the APY as a fraction
      const tokenContract = this.curveContractFactory.erc20({ address: stakedToken.address, network });
      const balanceRaw = await multicall.wrap(tokenContract).balanceOf(address);
      const balance = Number(balanceRaw) / 10 ** stakedToken.decimals;
      const balanceUSD = balance * stakedToken.price;

      // Calculate annual CRV rewards
      const gaugeContract = this.curveContractFactory.curveChildLiquidityGauge({ address, network });
      const period = await multicall.wrap(gaugeContract).period();
      const periodTimestamp = await multicall.wrap(gaugeContract).period_timestamp(period);
      const periodWeek = Math.floor(periodTimestamp.toNumber() / (86_400 * 7)); // num weeks
      const inflationRate = await multicall.wrap(gaugeContract).inflation_rate(periodWeek);
      const crvToken = rewardTokens.find(v => v.symbol === 'CRV' || v.symbol === '1CRV')!;
      const totalCrvRewardInUSD = new BigNumber(inflationRate.toString())
        .times(365 * 24 * 60 * 60)
        .times(crvToken.price)
        .dividedBy(10 ** crvToken.decimals)
        .toNumber();

      // Calculate annual bonus rewards
      const rewardTokenCount = await multicall.wrap(gaugeContract).reward_count();
      const individualRewardsInUSD = await Promise.all(
        range(0, Number(rewardTokenCount)).map(async index => {
          const rewardTokenAddressRaw = await multicall.wrap(gaugeContract).reward_tokens(index);
          const rewardTokenAddress = rewardTokenAddressRaw.toLowerCase();
          const rewardToken = rewardTokens.find(p => p.address === rewardTokenAddress);
          if (!rewardToken) return 0;

          const rewardData = await multicall.wrap(gaugeContract).reward_data(rewardTokenAddress);
          if (Number(rewardData.period_finish) < Date.now() / 1000) return 0;

          return new BigNumber(rewardData.rate.toString())
            .times(365 * 24 * 60 * 60)
            .times(rewardToken.price)
            .dividedBy(10 ** rewardToken.decimals)
            .toNumber();
        }),
      );

      // Calculate the ROIs
      const yearlyROI = balanceUSD > 0 ? (sum(individualRewardsInUSD) + totalCrvRewardInUSD) / balanceUSD : 0;
      const weeklyROI = yearlyROI / 52;
      const dailyROI = yearlyROI / 365;
      return { dailyROI, weeklyROI, yearlyROI };
    };
  }
}
