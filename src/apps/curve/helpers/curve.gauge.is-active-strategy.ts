import { Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { SingleStakingFarmContractPositionHelperParams } from '~app-toolkit';
import { IMulticallWrapper } from '~multicall/multicall.interface';

type CurveGaugeIsActiveStrategyParams<T> = {
  resolveInflationRate: (opts: { multicall: IMulticallWrapper; contract: T }) => Promise<BigNumberish>;
};

@Injectable()
export class CurveGaugeIsActiveStrategy {
  build<T>({
    resolveInflationRate,
  }: CurveGaugeIsActiveStrategyParams<T>): SingleStakingFarmContractPositionHelperParams<T>['resolveIsActive'] {
    return async ({ contract, multicall }) => {
      const inflationRate = await resolveInflationRate({ contract, multicall });
      return Number(inflationRate) > 0;
    };
  }
}
