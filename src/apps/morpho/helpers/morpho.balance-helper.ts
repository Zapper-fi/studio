import { Inject, Injectable } from '@nestjs/common';
import _uniq from 'lodash/uniq';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { CompoundSupplyTokenDataProps } from '~apps/compound/helper/compound.supply.token-helper';
import { MorphoCompoundLens } from '~apps/morpho/contracts';
import { MorphoMarketsHelper } from '~apps/morpho/helpers/morpho.markets-helper';
import { Network } from '~types';
export interface GetBalanceParams {
  appId: string;
  groupIds: string[];
  network: Network;
  address: string;
  lens: MorphoCompoundLens;
}

@Injectable()
export class MorphoBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MorphoMarketsHelper) private readonly marketsHelper: MorphoMarketsHelper,
  ) {}

  async getBalances({ appId, groupIds, network, address, lens }: GetBalanceParams) {
    const enteredMarkets: string[] = [];
    const positions = await this.appToolkit.getAppContractPositions<CompoundSupplyTokenDataProps>({
      appId,
      groupIds,
      network,
    });
    // we need a mapping underlying => cToken to have marketAddresses.
    await this.marketsHelper.setupMarkets(lens, network, appId);
    const toMarket = (underlying: string) =>
      Object.entries(this.marketsHelper.underlyings).find(
        ([, token]) => token.address.toLowerCase() === underlying.toLowerCase(),
      )![0];

    const borrowPositionsBalances = await Promise.all(
      positions.map(async position => {
        const token = position.tokens[0];
        const marketAddress = toMarket(token.address);
        const borrowRaw = await lens.getCurrentBorrowBalanceInOf(marketAddress, address);
        const userBorrow = borrowRaw.totalBalance.toString();
        const tokensBorrow = [drillBalance(token, userBorrow, { isDebt: true })];
        if (userBorrow !== '0') enteredMarkets.push(marketAddress.toLowerCase());
        return {
          ...position,
          tokens: tokensBorrow,
          balanceUSD: tokensBorrow[0].balanceUSD,
        };
      }),
    );
    const supplyPositionsBalances = await Promise.all(
      positions.map(async position => {
        const token = position.tokens[0];
        const marketAddress = toMarket(token.address);
        const supplyRaw = await lens.getCurrentSupplyBalanceInOf(marketAddress, address);
        const userSupply = supplyRaw.totalBalance.toString();
        const tokensSupply = [drillBalance(token, userSupply)];
        if (userSupply !== '0') enteredMarkets.push(marketAddress.toLowerCase());
        return {
          ...position,
          tokens: tokensSupply,
          balanceUSD: tokensSupply[0].balanceUSD,
        };
      }),
    );
    return { supplyPositionsBalances, borrowPositionsBalances, enteredMarkets: _uniq(enteredMarkets) };
  }
}
