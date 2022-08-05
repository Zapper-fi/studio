import { Injectable } from '@nestjs/common';
import { sum } from 'lodash';

import { SingleStakingFarmContractPositionHelperParams } from '~app-toolkit';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';

import { DopexStaking } from '../contracts';

@Injectable()
export class DopexDualRewardFarmRoiStrategy {
  build(): SingleStakingFarmContractPositionHelperParams<DopexStaking>['resolveRois'] {
    return async ({ contract, rewardTokens, multicall, liquidity, network }) => {
      const [rewardRateDPX, rewardRateRDPX] = await Promise.all([
        multicall.wrap(contract).rewardRateDPX(),
        multicall.wrap(contract).rewardRateRDPX(),
      ]);

      const rewardRates = [rewardRateDPX, rewardRateRDPX].map((v, i) => Number(v) / 10 ** rewardTokens[i].decimals);
      const dailyRewardRatesUSD = rewardTokens.map((v, i) => rewardRates[i] * BLOCKS_PER_DAY[network] * v.price);

      const dailyROI = (sum(dailyRewardRatesUSD) + liquidity) / liquidity - 1;
      const weeklyROI = dailyROI * 7;
      const yearlyROI = dailyROI * 365;
      return { dailyROI, weeklyROI, yearlyROI };
    };
  }
}
