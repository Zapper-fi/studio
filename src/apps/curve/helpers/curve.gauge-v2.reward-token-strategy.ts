import { Injectable } from '@nestjs/common';
import { range } from 'lodash';

import { SingleStakingFarmContractPositionHelperParams } from '~app-toolkit';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';

import { CurveGaugeV2 } from '../contracts';

@Injectable()
export class CurveGaugeV2RewardTokenStrategy {
  build(): SingleStakingFarmContractPositionHelperParams<CurveGaugeV2>['resolveRewardTokenAddresses'] {
    return async ({ contract, multicall }) => {
      // Gauge V2 supports up to 4 different reward tokens
      const MAX_REWARDS = 4;
      const wrapped = multicall.wrap(contract);
      const rewardTokenAddresses = await Promise.all(range(0, MAX_REWARDS).map(async i => wrapped.reward_tokens(i)));
      return rewardTokenAddresses.map(v => v.toLowerCase()).filter(v => v !== ZERO_ADDRESS);
    };
  }
}
