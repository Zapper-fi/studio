import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import { Network } from '~types/network.interface';

import { CompoundCToken } from '../contracts';

import { CompoundSupplyTokenDataProps } from './damm.supply.token-helper';

type CompoundSupplyBalanceHelperParams<T> = {
  address: string;
  network: Network;
  appId: string;
  groupId: string;
  getTokenContract: (opts: { address: string; network: Network }) => T;
  getBalanceRaw: (opts: { contract: T; multicall: IMulticallWrapper; address: string }) => Promise<BigNumberish>;
};

@Injectable()
export class CompoundSupplyBalanceHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) { }

  async getBalances<T = CompoundCToken>({
    address,
    network,
    appId,
    groupId,
    getTokenContract,
    getBalanceRaw,
  }: CompoundSupplyBalanceHelperParams<T>) {
    const multicall = this.appToolkit.getMulticall(network);

    const supplyTokens = await this.appToolkit.getAppTokenPositions<CompoundSupplyTokenDataProps>({
      appId,
      groupIds: [groupId],
      network,
    });

    const supplyTokenBalances = await Promise.all(
      supplyTokens.map(async supplyToken => {
        const supplyTokenContract = getTokenContract({ address: supplyToken.address, network });
        const balanceRaw = await getBalanceRaw({ contract: supplyTokenContract, multicall, address });
        return drillBalance(supplyToken, balanceRaw.toString());
      }),
    );

    return supplyTokenBalances;
  }
}
