import { Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { isArray } from 'lodash';

import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { Network } from '~types/network.interface';

import { MasterChefRewardRateStrategy } from './master-chef.contract-position-helper';

export type MasterChefV2RewardRateStrategyParams<T, V> = {
  resolveTotalAllocPoints: (opts: {
    network: Network;
    contract: T;
    multicall: Multicall;
    poolIndex: number;
  }) => BigNumberish | Promise<BigNumberish>;
  resolvePoolAllocPoints: (opts: {
    network: Network;
    contract: T;
    multicall: Multicall;
    poolIndex: number;
  }) => BigNumberish | Promise<BigNumberish>;
  resolvePrimaryTotalRewardPerBlock: (opts: {
    network: Network;
    contract: T;
    multicall: Multicall;
    poolIndex: number;
  }) => Promise<BigNumberish | BigNumberish[]>;
  resolveRewarderAddress: (opts: { multicall: Multicall; poolIndex: number; contract: T }) => Promise<string>;
  resolveRewarderContract: (opts: { rewarderAddress: string; network: Network }) => V;
  resolveSecondaryTotalRewardPerBlock: (opts: {
    multicall: Multicall;
    poolIndex: number;
    rewarderContract: V;
  }) => Promise<BigNumberish | BigNumberish[]>;
  resolveRewardMultiplier?: (opts: {
    network: Network;
    contract: T;
    multicall: Multicall;
    poolIndex: number;
  }) => Promise<BigNumberish | BigNumberish[]>;
};

@Injectable()
export class MasterChefV2RewardRateStrategy {
  build<T, V>({
    resolvePoolAllocPoints,
    resolveTotalAllocPoints,
    resolvePrimaryTotalRewardPerBlock,
    resolveRewarderAddress,
    resolveRewarderContract,
    resolveSecondaryTotalRewardPerBlock,
    resolveRewardMultiplier = async () => [1],
  }: MasterChefV2RewardRateStrategyParams<T, V>): MasterChefRewardRateStrategy<T> {
    return async opts => {
      // Resolve the reward allocations and reward per block from the primary chef contract
      const [totalAllocPoints, primaryTotalRewardPerBlock, poolAllocPoints, rewardMultiplier] = await Promise.all([
        resolveTotalAllocPoints(opts),
        resolvePrimaryTotalRewardPerBlock(opts),
        resolvePoolAllocPoints(opts),
        resolveRewardMultiplier(opts),
      ]);

      // Resolve additional rewarder address
      const rewarderAddressRaw = await resolveRewarderAddress(opts);
      const rewarderAddress = rewarderAddressRaw.toLowerCase();

      // Retrieve bonus token total reward per block if there's a valid rewarder
      const totalRewardPerBlock = [primaryTotalRewardPerBlock];
      if (rewarderAddress !== ZERO_ADDRESS) {
        const rewarderContract = resolveRewarderContract({ rewarderAddress, ...opts });
        const secondaryTotalRewardPerBlock = await resolveSecondaryTotalRewardPerBlock({ rewarderContract, ...opts });
        const secondaryTotalRewardPerBlocks = isArray(secondaryTotalRewardPerBlock)
          ? secondaryTotalRewardPerBlock
          : [secondaryTotalRewardPerBlock];
        totalRewardPerBlock.push(...secondaryTotalRewardPerBlocks);
      }

      // Calculate reward per block for the given pool's share
      const share = Number(poolAllocPoints) / Number(totalAllocPoints);
      const rewardPerBlock = totalRewardPerBlock.map((v, i) => share * Number(v) * Number(rewardMultiplier[i] ?? 1));
      return rewardPerBlock;
    };
  }
}
