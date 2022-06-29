import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { Network } from '~types/network.interface';

import { TectonicTToken } from '../contracts';

import { TectonicSupplyTokenDataProps } from './tectonic.supply.token-helper';

type TectonicBorrowBalanceHelperParams<T> = {
  address: string;
  network: Network;
  appId: string;
  groupId: string;
  getTokenContract: (opts: { address: string; network: Network }) => T;
  getBorrowBalanceRaw: (opts: { contract: T; multicall: Multicall; address: string }) => Promise<BigNumberish>;
};

@Injectable()
export class TectonicBorrowBalanceHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBalances<T = TectonicTToken>({
    address,
    network,
    appId,
    groupId,
    getTokenContract,
    getBorrowBalanceRaw,
  }: TectonicBorrowBalanceHelperParams<T>) {
    const multicall = this.appToolkit.getMulticall(network);

    const borrowPositions = await this.appToolkit.getAppContractPositions<TectonicSupplyTokenDataProps>({
      appId,
      groupIds: [groupId],
      network,
    });

    const borrowPositionBalances = await Promise.all(
      borrowPositions.map(async borrowPosition => {
        const borrowContract = getTokenContract({ address: borrowPosition.address, network });
        const balanceRaw = await getBorrowBalanceRaw({ contract: borrowContract, multicall, address });
        const tokens = [drillBalance(borrowPosition.tokens[0], balanceRaw.toString(), { isDebt: true })];
        return { ...borrowPosition, tokens, balanceUSD: tokens[0].balanceUSD };
      }),
    );

    return borrowPositionBalances;
  }
}
