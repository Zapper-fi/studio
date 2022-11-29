import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import { borrowed } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { CompoundCToken } from '../contracts';

import { CompoundSupplyTokenDataProps } from './compound.supply.token-helper';

type CompoundBorrowBalanceHelperParams<T> = {
  address: string;
  network: Network;
  appId: string;
  groupId: string;
  getTokenContract: (opts: { address: string; network: Network }) => T;
  getBorrowBalanceRaw: (opts: { contract: T; multicall: IMulticallWrapper; address: string }) => Promise<BigNumberish>;
};

@Injectable()
export class CompoundBorrowBalanceHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBalances<T = CompoundCToken>({
    address,
    network,
    appId,
    groupId,
    getTokenContract,
    getBorrowBalanceRaw,
  }: CompoundBorrowBalanceHelperParams<T>) {
    const multicall = this.appToolkit.getMulticall(network);

    const borrowPositions = await this.appToolkit.getAppContractPositions<CompoundSupplyTokenDataProps>({
      appId,
      groupIds: [groupId],
      network,
    });

    const borrowPositionBalances = await Promise.all(
      borrowPositions.map(async borrowPosition => {
        const borrowContract = getTokenContract({ address: borrowPosition.address, network });
        const balanceRaw = await getBorrowBalanceRaw({ contract: borrowContract, multicall, address });
        const tokens = [drillBalance(borrowed(borrowPosition.tokens[0]), balanceRaw.toString(), { isDebt: true })];
        return { ...borrowPosition, tokens, balanceUSD: tokens[0].balanceUSD };
      }),
    );

    return borrowPositionBalances;
  }
}
