import { Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { BigNumberish, ethers } from 'ethers';
import { isArray } from 'lodash';

import { IMulticallWrapper } from '~multicall/multicall.interface';
import { ContractPosition } from '~position/position.interface';
import { isClaimable } from '~position/position.utils';

import { DopexSsovContractPositionBalanceHelperParams } from './dopex.ssov.contract-position-balance-helper';
import { DopexSsovContractPositionDataProps } from './dopex.ssov.contract-position-helper';
import { SupportedSsov } from './dopex.ssov.deposit-balance-strategy';

type DopexSsovClaimableBalanceStrategyParams<T> = {
  resolveTotalEpochStrikeBalance: (opts: {
    multicall: IMulticallWrapper;
    contract: T;
    contractPosition: ContractPosition<DopexSsovContractPositionDataProps>;
  }) => Promise<BigNumberish | BigNumberish[]>;
};

@Injectable()
export class DopexSsovClaimableBalancesStrategy {
  constructor() {}

  build<T extends SupportedSsov>({
    resolveTotalEpochStrikeBalance,
  }: DopexSsovClaimableBalanceStrategyParams<T>): DopexSsovContractPositionBalanceHelperParams<T>['resolveExtraClaimableBalances'] {
    return async ({ contract, multicall, address, contractPosition }) => {
      const claimableTokens = contractPosition.tokens.filter(isClaimable);
      const epoch = contractPosition.dataProps.epoch;
      const strike = contractPosition.dataProps.strike;

      const userStrike = ethers.utils.solidityKeccak256(['address', 'uint256'], [address, strike]);
      const [totalDepositBalanceRaw, userDepositBalanceRaw] = await Promise.all([
        multicall.wrap(contract).totalEpochStrikeDeposits(epoch, strike),
        multicall.wrap(contract).userEpochDeposits(epoch, userStrike),
      ]);

      const share = Number(userDepositBalanceRaw) / Number(totalDepositBalanceRaw) || 0;
      if (share === 0) return claimableTokens.map(() => '0');

      const currentBalancesRaw = await resolveTotalEpochStrikeBalance({ multicall, contract, contractPosition });
      const currentBalancesRawArr = isArray(currentBalancesRaw) ? currentBalancesRaw : [currentBalancesRaw];
      return currentBalancesRawArr.map(v => new BigNumber(v.toString()).times(share).toFixed(0));
    };
  }
}
