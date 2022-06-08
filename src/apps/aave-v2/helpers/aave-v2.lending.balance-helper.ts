import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { Network } from '~types/network.interface';

import { AaveV2ContractFactory } from '../contracts';

type AaveV2LendingBalanceHelperParams = {
  address: string;
  appId: string;
  groupId: string;
  network: Network;
  isDebt?: boolean;
};

@Injectable()
export class AaveV2LendingBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AaveV2ContractFactory) private readonly contractFactory: AaveV2ContractFactory,
  ) {}

  async getLendingContractPositionBalances({
    address,
    appId,
    groupId,
    network,
    isDebt = false,
  }: AaveV2LendingBalanceHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);

    // Resolve supply, variable debt, and stable debt tokens
    const tokens = await this.appToolkit.getAppTokenPositions({ appId, groupIds: [groupId], network });

    // Represent the tokens as contract balances
    const balances = await Promise.all(
      tokens.map(async token => {
        const contract = this.contractFactory.erc20({ network, address: token.address });
        const balanceRaw = await multicall.wrap(contract).balanceOf(address);
        return drillBalance(token, balanceRaw.toString(), { isDebt });
      }),
    );

    return balances;
  }
}
