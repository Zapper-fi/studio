import { Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { isArray, sum } from 'lodash';

import { SingleStakingFarmResolveRoisParams } from '~app-toolkit/helpers/position/single-staking-farm.contract-position-helper';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';

export type SynthetixSingleStakingIsActiveStrategyParams<T> = {
  resolveRewardRates: (opts: { contract: T; multicall: Multicall }) => Promise<BigNumberish | BigNumberish[]>;
};

@Injectable()
export class SynthetixSingleStakingRoiStrategy {
  build<T>({
    resolveRewardRates,
  }: SynthetixSingleStakingIsActiveStrategyParams<T>): SingleStakingFarmResolveRoisParams<T> {
    return async ({ contract, multicall, rewardTokens, totalValueLocked }) => {
      const rewardRates = await resolveRewardRates({ contract, multicall }).then(v => (isArray(v) ? v : [v]));

      const dailyRewardRatesUSD = rewardRates.map((rewardRateRaw, i) => {
        if (!rewardTokens[i]) return 0;
        const rewardRate = Number(rewardRateRaw) / 10 ** rewardTokens[i].decimals;
        return rewardRate * 86400 * rewardTokens[i].price;
      });

      const dailyRewardUSD = sum(dailyRewardRatesUSD);
      const dailyROI = (dailyRewardUSD + totalValueLocked) / totalValueLocked - 1;
      const weeklyROI = dailyROI * 7;
      const yearlyROI = dailyROI * 365;

      return { dailyROI, weeklyROI, yearlyROI };
    };
  }
}
