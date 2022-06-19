import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { drillBalance } from '~app-toolkit';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { ContractPosition } from '~position/position.interface';
import { isClaimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { MasterChefClaimableTokenBalanceStrategy } from './master-chef.contract-position-balance-helper';
import { MasterChefContractPositionDataProps } from './master-chef.contract-position-helper';
import { MasterChefDefaultClaimableBalanceStrategy } from './master-chef.default.claimable-token-balances-strategy';

export type MasterChefRewarderClaimableBalanceStrategyParams<T, V> = {
  resolvePrimaryClaimableBalance: (opts: {
    address: string;
    multicall: Multicall;
    contract: T;
    contractPosition: ContractPosition<MasterChefContractPositionDataProps>;
  }) => Promise<BigNumberish>;
  resolveRewarderAddress: (opts: {
    multicall: Multicall;
    contract: T;
    contractPosition: ContractPosition<MasterChefContractPositionDataProps>;
  }) => Promise<string>;
  resolveRewarderContract: (opts: { rewarderAddress: string; network: Network }) => V;
  resolveSecondaryClaimableBalance: (opts: {
    address: string;
    multicall: Multicall;
    rewarderContract: V;
    contractPosition: ContractPosition<MasterChefContractPositionDataProps>;
  }) => Promise<BigNumberish>;
};

@Injectable()
export class MasterChefRewarderClaimableBalanceStrategy {
  constructor(
    @Inject(MasterChefDefaultClaimableBalanceStrategy)
    private readonly masterChefDefaultClaimableBalanceStrategy: MasterChefDefaultClaimableBalanceStrategy,
  ) {}

  build<T, V>({
    resolvePrimaryClaimableBalance,
    resolveRewarderAddress,
    resolveRewarderContract,
    resolveSecondaryClaimableBalance,
  }: MasterChefRewarderClaimableBalanceStrategyParams<T, V>): MasterChefClaimableTokenBalanceStrategy<T> {
    const primaryStrategy = this.masterChefDefaultClaimableBalanceStrategy.build({
      resolveClaimableBalance: resolvePrimaryClaimableBalance,
    });

    return async opts => {
      // Resolve the reward balance claimable from the primary chef contract
      const primaryClaimableBalances = await primaryStrategy(opts);

      // If there are no additional rewards on this index, return early
      const rewardTokens = opts.contractPosition.tokens.filter(isClaimable);
      if (rewardTokens.length < 2) return primaryClaimableBalances;

      // Resolve additional rewarder address
      const rewarderAddressRaw = await resolveRewarderAddress(opts);
      const rewarderAddress = rewarderAddressRaw.toLowerCase();
      if (rewarderAddress === ZERO_ADDRESS) return primaryClaimableBalances;

      // Resolve additional claimable amount from the rewarder contract
      const rewarderContract = resolveRewarderContract({ rewarderAddress, network: opts.network });
      const claimableBalanceRaw = await resolveSecondaryClaimableBalance({ rewarderContract, ...opts });
      const claimableToken = rewardTokens[1];
      return [...primaryClaimableBalances, drillBalance(claimableToken, claimableBalanceRaw.toString())];
    };
  }
}
