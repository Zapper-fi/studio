import { Injectable } from '@nestjs/common';
import _ from 'lodash';

import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { Network } from '~types/network.interface';

import { MasterChefRewardTokenAddressesStrategy } from './master-chef.contract-position-helper';

export type MasterChefRewarderClaimableBalanceStrategyParams<T, V> = {
  resolvePrimaryClaimableToken: (opts: { multicall: Multicall; contract: T }) => Promise<string>;
  resolveRewarderAddress: (opts: { multicall: Multicall; poolIndex: number; contract: T }) => Promise<string>;
  resolveRewarderContract: (opts: { rewarderAddress: string; network: Network }) => V;
  resolveSecondaryClaimableToken: (opts: {
    multicall: Multicall;
    poolIndex: number;
    rewarderContract: V;
  }) => Promise<string | string[]>;
};

@Injectable()
export class MasterChefRewarderClaimableTokenStrategy {
  build<T, V>({
    resolvePrimaryClaimableToken,
    resolveRewarderAddress,
    resolveRewarderContract,
    resolveSecondaryClaimableToken,
  }: MasterChefRewarderClaimableBalanceStrategyParams<T, V>): MasterChefRewardTokenAddressesStrategy<T> {
    return async opts => {
      // Resolve the reward token address from the primary chef contract
      const primaryRewardTokenAddress = await resolvePrimaryClaimableToken(opts);

      // Resolve additional rewarder address
      const rewarderAddressRaw = await resolveRewarderAddress(opts);
      const rewarderAddress = rewarderAddressRaw.toLowerCase();
      if (rewarderAddress === ZERO_ADDRESS) return [primaryRewardTokenAddress];

      // Resolve extra reward tokena address from the rewarder contract
      const rewarderContract = resolveRewarderContract({ rewarderAddress, network: opts.network });
      const secondaryRewardTokenAddress = await resolveSecondaryClaimableToken({ rewarderContract, ...opts });
      const secondaryRewardTokenAddresses = _.isArray(secondaryRewardTokenAddress)
        ? secondaryRewardTokenAddress
        : [secondaryRewardTokenAddress];
      return [primaryRewardTokenAddress.toLowerCase(), ...secondaryRewardTokenAddresses.map(v => v.toLowerCase())];
    };
  }
}
