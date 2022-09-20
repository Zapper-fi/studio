import { Inject, Injectable } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { MeshswapContractFactory } from '../contracts';

export type MeshswapContractPositionDataProps = {
  liquidity: number;
  exchangeRate: number;
};

type MeshswapSupplyBalanceHelperParams = {
  address: string;
  appId: string;
  groupId: string;
  network: Network;
};

@Injectable()
export class MeshswapSupplyBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MeshswapContractFactory) private readonly meshswapContractFactory: MeshswapContractFactory,
  ) {}

  async getSupplyBalances({ address, appId, groupId, network }: MeshswapSupplyBalanceHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);

    const tokens = await this.appToolkit.getAppTokenPositions<MeshswapContractPositionDataProps>({
      appId,
      network,
      groupIds: [groupId],
    });

    const supplyBalances = await Promise.all(
      tokens.map(async token => {
        const contract = this.meshswapContractFactory.erc20({ network, address: token.address });

        const balanceRaw = await multicall.wrap(contract).balanceOf(address);
        const balance = Number(balanceRaw) * token.dataProps.exchangeRate;

        return drillBalance(token, balance.toString());
      }),
    );

    return supplyBalances;
  }
}
