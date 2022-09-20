import { Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { MyceliumContractFactory } from '../contracts';
import MYCELIUM_DEFINITION from '../mycelium.definition';

import { MLP_VAULT_ADDRESS } from './mycelium.constants';

export type MyceliumLevTradesContractPositionDataProps = {
  collateralTokenAddress: string;
  indexTokenAddress: string;
  isLong: boolean;
};

type MyceliumLevTradesContractPositionHelperParams = {
  address: string;
  network: Network;
};

@Injectable()
export class MyceliumLevTradesBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MyceliumContractFactory) private readonly myceliumContractFactory: MyceliumContractFactory,
  ) {}

  async getBalance({ address, network }: MyceliumLevTradesContractPositionHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const mlpVaultContract = this.myceliumContractFactory.myceliumVault({
      address: MLP_VAULT_ADDRESS,
      network,
    });

    const contractPositions = await this.appToolkit.getAppContractPositions<MyceliumLevTradesContractPositionDataProps>(
      {
        appId: MYCELIUM_DEFINITION.id,
        groupIds: [MYCELIUM_DEFINITION.groups.levTrades.id],
        network,
      },
    );

    const levTradesBalances = await Promise.all(
      contractPositions.map(async (contractPosition, _index) => {
        const collateralTokenAddress = contractPosition.dataProps.collateralTokenAddress;
        const indexTokenAddress = contractPosition.dataProps.indexTokenAddress;
        const isLong = contractPosition.dataProps.isLong;

        const position = await multicall
          .wrap(mlpVaultContract)
          .getPosition(address, collateralTokenAddress, indexTokenAddress, isLong);

        if (Number(position[0]) === 0 && Number(position[1]) === 0) return null;

        const positionDelta = await multicall
          .wrap(mlpVaultContract)
          .getPositionDelta(address, collateralTokenAddress, indexTokenAddress, isLong);

        // Long profit in index token and short profit in usdc
        const profitToken =
          isLong == true
            ? baseTokens.find(x => x.address == indexTokenAddress)
            : baseTokens.find(x => x.symbol == 'USDC');
        if (!profitToken) return null;

        const initialCollateralRaw = position[1];
        const initialCollateral = Number(initialCollateralRaw) / 10 ** 30;
        const deltaRaw = positionDelta[1];
        const delta = Number(deltaRaw) / 10 ** 30;
        const hasProfit = positionDelta[0];
        const balanceUSD = hasProfit == true ? initialCollateral + delta : initialCollateral - delta;
        const balanceInProfitToken = balanceUSD / profitToken.price;
        const balanceInProfitTokenRaw = balanceInProfitToken * 10 ** profitToken.decimals;

        const tokenBalance = [drillBalance(profitToken, balanceInProfitTokenRaw.toString())];

        const contractPositionBalance: ContractPositionBalance = {
          ...contractPosition,
          tokens: tokenBalance,
          balanceUSD: balanceUSD,
        };
        return contractPositionBalance;
      }),
    );

    return _.compact(levTradesBalances);
  }
}
