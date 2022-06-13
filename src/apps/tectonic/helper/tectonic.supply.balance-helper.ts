import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { Network } from '~types/network.interface';

import { TectonicTToken } from '../contracts';

import { TectonicSupplyTokenDataProps } from './tectonic.supply.token-helper';

type TectonicSupplyBalanceHelperParams<T> = {
  address: string;
  network: Network;
  appId: string;
  groupId: string;
  getTokenContract: (opts: { address: string; network: Network }) => T;
  getBalanceRaw: (opts: { contract: T; multicall: Multicall; address: string }) => Promise<BigNumberish>;
};

@Injectable()
export class TectonicSupplyBalanceHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBalances<T = TectonicTToken>({
    address,
    network,
    appId,
    groupId,
    getTokenContract,
    getBalanceRaw,
  }: TectonicSupplyBalanceHelperParams<T>) {
    const multicall = this.appToolkit.getMulticall(network);

    const supplyTokens = await this.appToolkit.getAppTokenPositions<TectonicSupplyTokenDataProps>({
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
