import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { Network } from '~types/network.interface';

import { CompoundCToken } from '../contracts';

import { CompoundSupplyTokenDataProps } from './compound.supply.token-helper';

type CompoundLendingBalanceHelperParams<T> = {
  address: string;
  network: Network;
  appId: string;
  supplyGroupId: string;
  borrowGroupId: string;
  getTokenContract: (opts: { address: string; network: Network }) => T;
  getBalanceRaw: (opts: { contract: T; multicall: Multicall; address: string }) => Promise<BigNumberish>;
  getBorrowBalanceRaw: (opts: { contract: T; multicall: Multicall; address: string }) => Promise<BigNumberish>;
};

@Injectable()
export class CompoundLendingBalanceHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBalances<T = CompoundCToken>({
    address,
    network,
    appId,
    supplyGroupId,
    borrowGroupId,
    getTokenContract,
    getBalanceRaw,
    getBorrowBalanceRaw,
  }: CompoundLendingBalanceHelperParams<T>) {
    const multicall = this.appToolkit.getMulticall(network);

    const [supplyTokens, borrowPositions] = await Promise.all([
      this.appToolkit.getAppTokenPositions<CompoundSupplyTokenDataProps>({
        appId,
        groupIds: [supplyGroupId],
        network,
      }),
      this.appToolkit.getAppContractPositions<CompoundSupplyTokenDataProps>({
        appId,
        groupIds: [borrowGroupId],
        network,
      }),
    ]);

    const [supplyTokenBalances, borrowPositionBalances] = await Promise.all([
      Promise.all(
        supplyTokens.map(async supplyToken => {
          const supplyTokenContract = getTokenContract({ address: supplyToken.address, network });
          const balanceRaw = await getBalanceRaw({ contract: supplyTokenContract, multicall, address });
          return drillBalance(supplyToken, balanceRaw.toString());
        }),
      ),
      Promise.all(
        borrowPositions.map(async borrowPosition => {
          const borrowContract = getTokenContract({ address: borrowPosition.address, network });
          const balanceRaw = await getBorrowBalanceRaw({ contract: borrowContract, multicall, address });
          const tokens = [drillBalance(borrowPosition.tokens[0], balanceRaw.toString(), { isDebt: true })];
          return { ...borrowPosition, tokens, balanceUSD: tokens[0].balanceUSD };
        }),
      ),
    ]);

    return [...supplyTokenBalances, ...borrowPositionBalances];
  }
}
