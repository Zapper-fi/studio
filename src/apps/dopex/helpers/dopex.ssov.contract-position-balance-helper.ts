import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import _ from 'lodash';
import { sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import { ContractPosition } from '~position/position.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { DopexSsovContractPositionDataProps } from './dopex.ssov.contract-position-helper';

export type DopexSsovContractPositionBalanceHelperParams<T> = {
  address: string;
  network: Network;
  appId: string;
  groupId: string;
  resolveSsovContract: (opts: { address: string; network: Network }) => T;
  resolveDepositBalance: (opts: {
    contract: T;
    contractPosition: ContractPosition<DopexSsovContractPositionDataProps>;
    multicall: IMulticallWrapper;
    address: string;
  }) => Promise<BigNumberish>;
  resolveExtraClaimableBalances?: (opts: {
    contract: T;
    contractPosition: ContractPosition<DopexSsovContractPositionDataProps>;
    multicall: IMulticallWrapper;
    address: string;
  }) => Promise<BigNumberish[]>;
};

@Injectable()
export class DopexSsovContractPositionBalanceHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBalances<T>({
    address,
    network,
    appId,
    groupId,
    resolveSsovContract,
    resolveDepositBalance,
    resolveExtraClaimableBalances = async () => [],
  }: DopexSsovContractPositionBalanceHelperParams<T>) {
    const multicall = this.appToolkit.getMulticall(network);
    const ssovPositions = await this.appToolkit.getAppContractPositions<DopexSsovContractPositionDataProps>({
      appId,
      groupIds: [groupId],
      network,
    });

    const balances = await Promise.all(
      ssovPositions.map(async ssovPosition => {
        const ssovContract = resolveSsovContract({ address: ssovPosition.address, network });

        const [depositRaw, claimablesRaw] = await Promise.all([
          resolveDepositBalance({
            contract: ssovContract,
            contractPosition: ssovPosition,
            multicall,
            address,
          }),
          resolveExtraClaimableBalances({
            contract: ssovContract,
            contractPosition: ssovPosition,
            multicall,
            address,
          }),
        ]);

        const depositToken = ssovPosition.tokens.find(isSupplied);
        const claimableTokens = ssovPosition.tokens.filter(isClaimable);
        if (!depositToken || !claimableTokens) return null;

        const depositTokenBalance = drillBalance(depositToken, depositRaw.toString());
        const claimTokenBalances = claimableTokens.map((v, i) => drillBalance(v, claimablesRaw[i]?.toString() ?? '0'));
        const tokens = [depositTokenBalance, ...claimTokenBalances.filter(v => v.balanceUSD > 0)];
        const balanceUSD = sumBy(tokens, v => v.balanceUSD);

        const borrowContractPositionBalance = { ...ssovPosition, tokens, balanceUSD };
        return borrowContractPositionBalance;
      }),
    );

    return _.compact(balances);
  }
}
