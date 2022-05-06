import { Inject, Injectable } from '@nestjs/common';
import { sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { EthersMulticall as Multicall } from '~multicall';
import { DefaultDataProps, WithMetaType } from '~position/display.interface';
import { ContractPositionBalance, TokenBalance } from '~position/position-balance.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

type GetTokenBalancesParams<T> = {
  network: Network;
  appId: string;
  groupId: string;
  address: string;
  resolveBalances: (opts: {
    address: string;
    network: Network;
    multicall: Multicall;
    contractPosition: ContractPosition<T>;
  }) => Promise<WithMetaType<TokenBalance>[]>;
};

@Injectable()
export class ContractPositionBalanceHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getContractPositionBalances<T = DefaultDataProps>({
    network,
    appId,
    groupId,
    address,
    resolveBalances,
  }: GetTokenBalancesParams<T>) {
    const multicall = this.appToolkit.getMulticall(network);
    const contractPositions = await this.appToolkit.getAppContractPositions<T>({
      appId,
      network,
      groupIds: [groupId],
    });

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const tokens = await resolveBalances({ multicall, network, address, contractPosition });
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);
        const balance: ContractPositionBalance<T> = { ...contractPosition, tokens, balanceUSD };
        return balance;
      }),
    );

    return balances;
  }
}
