import { Injectable } from '@nestjs/common';
import _ from 'lodash';

import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import { Network } from '~types/network.interface';

import { MasterChefRewardTokenAddressesStrategy } from './master-chef.contract-position-helper';

export type MasterChefV2ClaimableTokenStrategyParams<T, V> = {
  resolvePrimaryClaimableToken: (opts: { multicall: IMulticallWrapper; contract: T }) => Promise<string>;
  resolveRewarderAddress: (opts: { multicall: IMulticallWrapper; poolIndex: number; contract: T }) => Promise<string>;
  resolveRewarderContract: (opts: { rewarderAddress: string; network: Network }) => V;
  resolveSecondaryClaimableToken: (opts: {
    multicall: IMulticallWrapper;
    poolIndex: number;
    rewarderContract: V;
  }) => Promise<string | string[]>;
};

@Injectable()
export class MasterChefV2ClaimableTokenStrategy {
  build<T, V>({
    resolvePrimaryClaimableToken,
    resolveRewarderAddress,
    resolveRewarderContract,
    resolveSecondaryClaimableToken,
  }: MasterChefV2ClaimableTokenStrategyParams<T, V>): MasterChefRewardTokenAddressesStrategy<T> {
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
