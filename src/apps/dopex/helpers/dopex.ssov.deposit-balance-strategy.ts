import { Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { BigNumberish, ethers } from 'ethers';

import { IMulticallWrapper } from '~multicall/multicall.interface';
import { ContractPosition } from '~position/position.interface';

import { DopexDpxSsov, DopexGmxSsov, DopexGOhmSsov, DopexEthSsov, DopexRdpxSsov } from '../contracts';

import { DopexSsovContractPositionBalanceHelperParams } from './dopex.ssov.contract-position-balance-helper';
import { DopexSsovContractPositionDataProps } from './dopex.ssov.contract-position-helper';

export type SupportedSsov = DopexDpxSsov | DopexRdpxSsov | DopexEthSsov | DopexGOhmSsov | DopexGmxSsov;

type DopexSsovDepositBalanceStrategyParams<T> = {
  resolveFinalEpochStrikeBalance: (opts: {
    multicall: IMulticallWrapper;
    contract: T;
    contractPosition: ContractPosition<DopexSsovContractPositionDataProps>;
  }) => Promise<BigNumberish>;
};

@Injectable()
export class DopexSsovDepositBalanceStrategy {
  constructor() {}

  build<T extends SupportedSsov>({
    resolveFinalEpochStrikeBalance,
  }: DopexSsovDepositBalanceStrategyParams<T>): DopexSsovContractPositionBalanceHelperParams<T>['resolveDepositBalance'] {
    return async ({ contract, contractPosition, multicall, address }) => {
      const epoch = contractPosition.dataProps.epoch;
      const strike = contractPosition.dataProps.strike;

      const userStrike = ethers.utils.solidityKeccak256(['address', 'uint256'], [address, strike]);
      const [totalDepositBalanceRaw, userDepositBalanceRaw] = await Promise.all([
        multicall.wrap(contract).totalEpochStrikeDeposits(epoch, strike),
        multicall.wrap(contract).userEpochDeposits(epoch, userStrike),
      ]);

      const share = Number(userDepositBalanceRaw) / Number(totalDepositBalanceRaw) || 0;
      if (share === 0) return '0';

      // Resolve the final epoch strike balance; if 0, then simply use the deposits because the final PnL hasn't been tallied
      const finalBalanceRaw = await resolveFinalEpochStrikeBalance({ multicall, contract, contractPosition });
      const realCurrentBalanceRaw = Number(finalBalanceRaw) === 0 ? totalDepositBalanceRaw : finalBalanceRaw;
      const balanceRaw = new BigNumber(realCurrentBalanceRaw.toString()).times(share).toFixed(0);

      return balanceRaw;
    };
  }
}
