import { Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { isArray } from 'lodash';

import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import { Network } from '~types/network.interface';

import { MasterChefRewardRateStrategy } from './master-chef.contract-position-helper';

export type MasterChefV2RewardRateStrategyParams<T, V> = {
  resolveTotalAllocPoints: (opts: {
    network: Network;
    contract: T;
    multicall: IMulticallWrapper;
    poolIndex: number;
  }) => BigNumberish | Promise<BigNumberish>;
  resolvePoolAllocPoints: (opts: {
    network: Network;
    contract: T;
    multicall: IMulticallWrapper;
    poolIndex: number;
  }) => BigNumberish | Promise<BigNumberish>;
  resolvePrimaryTotalRewardRate: (opts: {
    network: Network;
    contract: T;
    multicall: IMulticallWrapper;
    poolIndex: number;
  }) => Promise<BigNumberish | BigNumberish[]>;
  resolveRewarderAddress: (opts: { multicall: IMulticallWrapper; poolIndex: number; contract: T }) => Promise<string>;
  resolveRewarderContract: (opts: { rewarderAddress: string; network: Network }) => V;
  resolveSecondaryTotalRewardRate: (opts: {
    multicall: IMulticallWrapper;
    poolIndex: number;
    rewarderContract: V;
  }) => Promise<BigNumberish | BigNumberish[]>;
  resolveRewardMultiplier?: (opts: {
    network: Network;
    contract: T;
    multicall: IMulticallWrapper;
    poolIndex: number;
  }) => Promise<BigNumberish | BigNumberish[]>;
};

@Injectable()
export class MasterChefV2RewardRateStrategy {
  build<T, V>({
    resolvePoolAllocPoints,
    resolveTotalAllocPoints,
    resolvePrimaryTotalRewardRate,
    resolveRewarderAddress,
    resolveRewarderContract,
    resolveSecondaryTotalRewardRate,
    resolveRewardMultiplier = async () => [1],
  }: MasterChefV2RewardRateStrategyParams<T, V>): MasterChefRewardRateStrategy<T> {
    return async opts => {
      // Resolve the reward allocations and reward per block from the primary chef contract
      const [totalAllocPoints, primaryTotalRewardRate, poolAllocPoints, rewardMultiplier] = await Promise.all([
        resolveTotalAllocPoints(opts),
        resolvePrimaryTotalRewardRate(opts),
        resolvePoolAllocPoints(opts),
        resolveRewardMultiplier(opts),
      ]);

      // Resolve additional rewarder address
      const rewarderAddressRaw = await resolveRewarderAddress(opts);
      const rewarderAddress = rewarderAddressRaw.toLowerCase();

      // Retrieve bonus token total reward per block if there's a valid rewarder
      const totalRewardRate = [primaryTotalRewardRate];
      if (rewarderAddress !== ZERO_ADDRESS) {
        const rewarderContract = resolveRewarderContract({ rewarderAddress, ...opts });
        const secondaryTotalRewardRate = await resolveSecondaryTotalRewardRate({ rewarderContract, ...opts });
        const secondaryTotalRewardRates = isArray(secondaryTotalRewardRate)
          ? secondaryTotalRewardRate
          : [secondaryTotalRewardRate];
        totalRewardRate.push(...secondaryTotalRewardRates);
      }

      // Calculate reward per block for the given pool's share
      const share = Number(poolAllocPoints) / Number(totalAllocPoints);
      const rewardRate = totalRewardRate.map((v, i) => share * Number(v) * Number(rewardMultiplier[i] ?? 1));
      return rewardRate;
    };
  }
}
