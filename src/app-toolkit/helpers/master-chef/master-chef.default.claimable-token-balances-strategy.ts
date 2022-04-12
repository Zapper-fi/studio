import { Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { drillBalance } from '~app-toolkit';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { ContractPosition } from '~position/position.interface';
import { isClaimable } from '~position/position.utils';

import { MasterChefClaimableTokenBalanceStrategy } from './master-chef.contract-position-balance-helper';
import { MasterChefContractPositionDataProps } from './master-chef.contract-position-helper';

export type MasterChefDefaultClaimableBalanceStrategyParams<T> = {
  resolveClaimableBalance: (opts: {
    address: string;
    multicall: Multicall;
    contract: T;
    contractPosition: ContractPosition<MasterChefContractPositionDataProps>;
  }) => Promise<BigNumberish>;
};

@Injectable()
export class MasterChefDefaultClaimableBalanceStrategy {
  build<T>({
    resolveClaimableBalance,
  }: MasterChefDefaultClaimableBalanceStrategyParams<T>): MasterChefClaimableTokenBalanceStrategy<T> {
    return async opts => {
      const { address, contract, multicall, contractPosition } = opts;
      const claimableToken = contractPosition.tokens.find(isClaimable);
      if (!claimableToken) return [];

      const balanceRaw = await resolveClaimableBalance({ address, contract, multicall, contractPosition });
      const balance = drillBalance(claimableToken, balanceRaw.toString());
      return [balance];
    };
  }
}
