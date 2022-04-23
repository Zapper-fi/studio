import { Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { SingleStakingFarmContractPositionHelperParams } from '~app-toolkit';
import { EthersMulticall } from '~multicall';
import { Network } from '~types/network.interface';

type CurveGaugeRoiStrategyParams<T, V> = {
  resolveInflationRate: (opts: { multicall: EthersMulticall; gaugeContract: T }) => Promise<BigNumberish>;
  resolveWorkingSupply: (opts: { multicall: EthersMulticall; gaugeContract: T }) => Promise<BigNumberish>;
  resolveRelativeWeight: (opts: {
    multicall: EthersMulticall;
    controllerContract: V;
    address: string;
  }) => Promise<BigNumberish>;
  resolveControllerContract: (opts: { network: Network }) => V;
};

@Injectable()
export class CurveGaugeRoiStrategy {
  build<T, V>({
    resolveControllerContract,
    resolveInflationRate,
    resolveRelativeWeight,
    resolveWorkingSupply,
  }: CurveGaugeRoiStrategyParams<T, V>): SingleStakingFarmContractPositionHelperParams<T>['resolveRois'] {
    return async ({ address, contract, multicall, rewardTokens, stakedToken, network }) => {
      const controllerContract = resolveControllerContract({ network });
      const [inflationRate, workingSupply, relativeWeight] = await Promise.all([
        resolveInflationRate({ multicall, gaugeContract: contract }).then(v => Number(v) / 10 ** 18),
        resolveWorkingSupply({ multicall, gaugeContract: contract }).then(v => Number(v) / 10 ** 18),
        resolveRelativeWeight({ multicall, controllerContract, address }).then(v => Number(v) / 10 ** 18),
      ]);

      const dailyROI =
        ((((inflationRate * relativeWeight * 86400) / workingSupply) * 0.4) / stakedToken.price) *
        rewardTokens[0].price;
      const weeklyROI =
        ((((inflationRate * relativeWeight * 604800) / workingSupply) * 0.4) / stakedToken.price) *
        rewardTokens[0].price;
      const yearlyROI =
        ((((inflationRate * relativeWeight * 31536000) / workingSupply) * 0.4) / stakedToken.price) *
        rewardTokens[0].price;

      return {
        dailyROI,
        weeklyROI,
        yearlyROI,
      };
    };
  }
}
