import { Injectable } from '@nestjs/common';
import { range } from 'lodash';

import { SingleStakingFarmContractPositionHelperParams } from '~app-toolkit';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';

import { CurveChildLiquidityGauge } from '../contracts';

type CurveChildLiquidityGaugeRewardTokenStrategyParams = {
  crvTokenAddress: string;
};

@Injectable()
export class CurveChildLiquidityGaugeRewardTokenStrategy {
  build({
    crvTokenAddress,
  }: CurveChildLiquidityGaugeRewardTokenStrategyParams): SingleStakingFarmContractPositionHelperParams<CurveChildLiquidityGauge>['resolveRewardTokenAddresses'] {
    return async ({ contract, multicall }) => {
      // Gauge V2 supports up to 4 different reward tokens
      const MAX_REWARDS = 4;
      const wrapped = multicall.wrap(contract);
      const rewardTokenAddresses = await Promise.all(range(0, MAX_REWARDS).map(async i => wrapped.reward_tokens(i)));
      return [crvTokenAddress, ...rewardTokenAddresses.map(v => v.toLowerCase()).filter(v => v !== ZERO_ADDRESS)];
    };
  }
}
