import { Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { SingleStakingFarmResolveIsActiveParams } from '~app-toolkit/helpers/position/single-staking-farm.contract-position-helper';
import { IMulticallWrapper } from '~multicall/multicall.interface';

export type SynthetixSingleStakingIsActiveStrategyParams<T> = {
  resolvePeriodFinish: (opts: { contract: T; multicall: IMulticallWrapper }) => Promise<BigNumberish>;
};

@Injectable()
export class SynthetixSingleStakingIsActiveStrategy {
  build<T>({
    resolvePeriodFinish,
  }: SynthetixSingleStakingIsActiveStrategyParams<T>): SingleStakingFarmResolveIsActiveParams<T> {
    return async ({ contract, multicall }) => {
      const periodFinish = await resolvePeriodFinish({ multicall, contract });
      const now = Math.floor(Date.now() / 1000) - 60 * 60;
      return Number(periodFinish) > now;
    };
  }
}
