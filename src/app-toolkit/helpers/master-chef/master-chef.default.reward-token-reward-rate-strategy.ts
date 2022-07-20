import { Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { isArray } from 'lodash';

import { IMulticallWrapper } from '~multicall/multicall.interface';
import { Network } from '~types/network.interface';

import { MasterChefRewardRateStrategy } from './master-chef.contract-position-helper';

export type MasterChefDefaultRewardRateStrategyParams<T> = {
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
  resolveTotalRewardRate: (opts: {
    network: Network;
    contract: T;
    multicall: IMulticallWrapper;
    poolIndex: number;
  }) => Promise<BigNumberish | BigNumberish[]>;
  resolveRewardMultiplier?: (opts: {
    network: Network;
    contract: T;
    multicall: IMulticallWrapper;
    poolIndex: number;
  }) => Promise<BigNumberish | BigNumberish[]>;
};

@Injectable()
export class MasterChefDefaultRewardRateStrategy {
  build<T>({
    resolvePoolAllocPoints,
    resolveTotalAllocPoints,
    resolveTotalRewardRate,
    resolveRewardMultiplier = async () => [1],
  }: MasterChefDefaultRewardRateStrategyParams<T>): MasterChefRewardRateStrategy<T> {
    return async ({ multicall, poolIndex, contract, network }) => {
      const [totalAllocPoints, totalRewardPerBlock, poolAllocPoints, rewardMultiplier] = await Promise.all([
        resolveTotalAllocPoints({ contract, multicall, poolIndex, network }),
        resolveTotalRewardRate({ contract, multicall, poolIndex, network }),
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
