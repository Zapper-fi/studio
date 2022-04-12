import { Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { drillBalance } from '~app-toolkit';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { ContractPosition } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';

import { MasterChefStakedTokenBalanceStrategy } from './master-chef.contract-position-balance-helper';
import { MasterChefContractPositionDataProps } from './master-chef.contract-position-helper';

export type MasterChefDefaultStakedBalanceStrategyParams<T> = {
  resolveStakedBalance: (opts: {
    address: string;
    multicall: Multicall;
    contract: T;
    contractPosition: ContractPosition<MasterChefContractPositionDataProps>;
  }) => Promise<BigNumberish>;
};

@Injectable()
export class MasterChefDefaultStakedBalanceStrategy {
  build<T>({
    resolveStakedBalance,
  }: MasterChefDefaultStakedBalanceStrategyParams<T>): MasterChefStakedTokenBalanceStrategy<T> {
    return async opts => {
      const { address, contract, multicall, contractPosition } = opts;
      const stakedToken = contractPosition.tokens.find(isSupplied);
      if (!stakedToken) return null;

      const balanceRaw = await resolveStakedBalance({ address, contract, multicall, contractPosition });
      const balance = drillBalance(stakedToken, balanceRaw.toString());
      return balance;
    };
  }
}
