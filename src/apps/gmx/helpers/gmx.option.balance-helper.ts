import { Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { GmxContractFactory } from '../contracts';
import GMX_DEFINITION from '../gmx.definition';

export type GmxOptionContractPositionDataProps = {
  collateralTokenAddress: string;
  indexTokenAddress: string;
  isLong: boolean;
};

type GetOptionContractPositionHelperParams = {
  network: Network;
  vaultAddress: string;
  address: string;
};

@Injectable()
export class GmxOptionBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(GmxContractFactory) private readonly contractFactory: GmxContractFactory,
  ) {}

  async getBalance({ address, network, vaultAddress }: GetOptionContractPositionHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const vaultContract = this.contractFactory.gmxVault({ address: vaultAddress, network });

    const contractPositions = await this.appToolkit.getAppContractPositions<GmxOptionContractPositionDataProps>({
      appId: GMX_DEFINITION.id,
      groupIds: [GMX_DEFINITION.groups.option.id],
      network,
    });

    const optionBalances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const collateralTokenAddress = contractPosition.dataProps.collateralTokenAddress;
        const indexTokenAddress = contractPosition.dataProps.indexTokenAddress;
        const isLong = contractPosition.dataProps.isLong;

        const position = await multicall
          .wrap(vaultContract)
          .getPosition(address, collateralTokenAddress, indexTokenAddress, isLong);
        // non existing position returns size and collateral = 0
        if (Number(position[0]) == 0 && Number(position[1]) == 0) return null;

        const positionDelta = await multicall
          .wrap(vaultContract)
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

    return _.compact(optionBalances);
  }
}
