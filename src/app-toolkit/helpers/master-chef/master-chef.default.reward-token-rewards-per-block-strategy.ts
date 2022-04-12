import { Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { isArray } from 'lodash';

import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { Network } from '~types/network.interface';

import { MasterChefRewardsPerBlockStrategy } from './master-chef.contract-position-helper';

export type MasterChefDefaultRewardsPerBlockStrategyParams<T> = {
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
  resolveTotalRewardPerBlock: (opts: {
    network: Network;
    contract: T;
    multicall: Multicall;
    poolIndex: number;
  }) => Promise<BigNumberish | BigNumberish[]>;
  resolveRewardMultiplier?: (opts: {
    network: Network;
    contract: T;
    multicall: Multicall;
    poolIndex: number;
  }) => Promise<BigNumberish | BigNumberish[]>;
};

@Injectable()
export class MasterChefDefaultRewardsPerBlockStrategy {
  build<T>({
    resolvePoolAllocPoints,
    resolveTotalAllocPoints,
    resolveTotalRewardPerBlock,
    resolveRewardMultiplier = async () => [1],
  }: MasterChefDefaultRewardsPerBlockStrategyParams<T>): MasterChefRewardsPerBlockStrategy<T> {
    return async ({ multicall, poolIndex, contract, network }) => {
      const [totalAllocPoints, totalRewardPerBlock, poolAllocPoints, rewardMultiplier] = await Promise.all([
        resolveTotalAllocPoints({ contract, multicall, poolIndex, network }),
        resolveTotalRewardPerBlock({ contract, multicall, poolIndex, network }),
        resolvePoolAllocPoints({ contract, multicall, poolIndex, network }),
        resolveRewardMultiplier({ contract, multicall, poolIndex, network }),
      ]);

      const poolShare = Number(poolAllocPoints) / Number(totalAllocPoints);
      const totalRewardPerBlockArr = isArray(totalRewardPerBlock) ? totalRewardPerBlock : [totalRewardPerBlock];
      const rewardPerBlock = totalRewardPerBlockArr.map(
        (v, i) => poolShare * Number(v) * Number(rewardMultiplier[i] ?? 1),
      );

      return rewardPerBlock;
    };
  }
}
