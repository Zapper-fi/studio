import { Inject, Injectable } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { MyceliumContractFactory } from '../contracts';
import MYCELIUM_DEFINITION from '../mycelium.definition';

export type MyceliumLevTradesContractPositionDataProps = {
  rewardsTokenAddress: string;
  decimals: number;
};

type MyceliumPerpTokensFarmsContractPositionHelperParams = {
  address: string;
  network: Network;
};

@Injectable()
export class MyceliumPerpTokensFarmBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MyceliumContractFactory) private readonly myceliumContractFactory: MyceliumContractFactory,
  ) {}

  async getBalance({ address, network }: MyceliumPerpTokensFarmsContractPositionHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);

    const contractPositions = await this.appToolkit.getAppContractPositions<MyceliumLevTradesContractPositionDataProps>(
      {
        appId: MYCELIUM_DEFINITION.id,
        groupIds: [MYCELIUM_DEFINITION.groups.perpFarms.id],
        network,
      },
    );

    const farmsBalances = await Promise.all(
      contractPositions.map(async (contractPosition, _index) => {
        const perpFarmContract = this.myceliumContractFactory.myceliumPerpFarm({
          address: contractPosition.address,
          network,
        });

        const [balanceRaw, earnedRewardsRaw] = await Promise.all([
          multicall.wrap(perpFarmContract).balanceOf(address),
          multicall.wrap(perpFarmContract).earned(address),
        ]);

        if (Number(balanceRaw) === 0 || Number(earnedRewardsRaw) === 0) return null;

        const balance = Number(balanceRaw) / 10 ** contractPosition.dataProps.decimals;
        const balanceUSD = contractPosition.tokens[0].price * balance;

        const tokenBalance = [drillBalance(contractPosition.tokens[0], balanceRaw.toString())];

        const contractPositionBalance: ContractPositionBalance = {
          ...contractPosition,
          tokens: tokenBalance,
          balanceUSD: balanceUSD,
        };
        return contractPositionBalance;
      }),
    );

    return farmsBalances;
  }
}
