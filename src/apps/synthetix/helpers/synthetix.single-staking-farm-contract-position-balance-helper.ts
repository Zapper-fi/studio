import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  SingleStakingContractStrategy,
  SingleStakingRewardTokenBalanceStrategy,
  SingleStakingStakedTokenBalanceStrategy,
} from '~app-toolkit/helpers/balance/single-staking-farm.contract-position-balance-helper';
import { Network } from '~types/network.interface';

import { SynthetixContractFactory, SynthetixRewards } from '../contracts';

export type SynthetixSingleStakingFarmContractPositionBalanceHelperParams = {
  address: string;
  network: Network;
  appId: string;
  groupId: string;
  resolveContract?: SingleStakingContractStrategy<SynthetixRewards>;
  resolveStakedTokenBalance?: SingleStakingStakedTokenBalanceStrategy<SynthetixRewards>;
  resolveRewardTokenBalances?: SingleStakingRewardTokenBalanceStrategy<SynthetixRewards>;
};

@Injectable()
export class SynthetixSingleStakingFarmContractPositionBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory)
    private readonly synthetixContractFactory: SynthetixContractFactory,
  ) {}

  getBalances({
    address,
    appId,
    groupId,
    network,
    resolveContract = opts => this.synthetixContractFactory.synthetixRewards(opts),
    resolveStakedTokenBalance = ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
    resolveRewardTokenBalances = ({ contract, address, multicall }) => multicall.wrap(contract).earned(address),
  }: SynthetixSingleStakingFarmContractPositionBalanceHelperParams) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<SynthetixRewards>({
      address,
      appId,
      groupId,
      network,
      resolveContract,
      resolveStakedTokenBalance,
      resolveRewardTokenBalances,
    });
  }
}
