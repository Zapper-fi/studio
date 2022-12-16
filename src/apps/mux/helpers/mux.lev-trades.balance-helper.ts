import { Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { MuxContractFactory } from '~apps/mux';
import {
  _0,
  computePositionPnlUsd,
  encodeSubAccountId,
  fromWei,
  getCollateralTokensByNetwork,
  getMarketTokensByNetwork,
  READER_ADDRESS,
} from '~apps/mux/helpers/common';
import { MuxLevTradesContractPositionDataProps } from '~apps/mux/helpers/mux.lev-trades.contract-position-helper';
import { Network } from '~types/network.interface';

import MUX_DEFINITION from '../mux.definition';

type GetLevTradesContractPositionHelperParams = {
  network: Network;
  address: string;
};

@Injectable()
export class MuxLevTradesBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MuxContractFactory) private readonly contractFactory: MuxContractFactory,
  ) {}

  async getBalance({ address, network }: GetLevTradesContractPositionHelperParams) {
    const muxReaderContract = this.contractFactory.muxReader({
      address: READER_ADDRESS[network],
      network,
    });

    const levTrades = await this.appToolkit.getAppContractPositions<MuxLevTradesContractPositionDataProps>({
      appId: MUX_DEFINITION.id,
      groupIds: [MUX_DEFINITION.groups.levTrades.id],
      network,
    });

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const marketTokens = await getMarketTokensByNetwork(network, this.appToolkit);
    const collateralTokens = await getCollateralTokensByNetwork(network, this.appToolkit);
    const contractPositions = await Promise.all(
      levTrades.map(async levTrade => {
        const collateralTokenId = levTrade.dataProps.collateralTokenId;
        const marketTokenId = levTrade.dataProps.marketTokenId;
        const isLong = levTrade.dataProps.isLong;

        const collateralToken = collateralTokens.find(x => x.muxTokenId == collateralTokenId);
        const marketToken = marketTokens.find(x => x.muxTokenId == marketTokenId);
        const subAccountId = encodeSubAccountId(address, collateralTokenId, marketTokenId, isLong);
        if (!subAccountId || !marketToken || !collateralToken) return;

        const { collateral, size, entryPrice, lastIncreasedTime } = (
          await muxReaderContract.getSubAccounts([subAccountId])
        )[0];

        const { pnlUsd } = computePositionPnlUsd(
          marketToken,
          fromWei(size),
          fromWei(entryPrice),
          lastIncreasedTime,
          isLong,
        );

        const collateralAmount = fromWei(collateral);
        const collateralAmountUsd = collateralAmount.times(collateralToken.price);

        const hasProfit = pnlUsd.gt(0);
        const profitToken = isLong
          ? marketTokens.find(x => x.muxTokenId == marketTokenId)
          : baseTokens.find(x => x.symbol == 'USDC');
        if (!profitToken || !collateralToken) return;

        let balanceInCollateralToken = collateralAmount;
        let balanceInCollateralTokenRaw = balanceInCollateralToken.shiftedBy(collateralToken.decimals);
        let balanceInProfitToken = pnlUsd.div(profitToken.price);
        let balanceInProfitTokenRaw = balanceInProfitToken.shiftedBy(profitToken.decimals);

        if (!hasProfit) {
          balanceInCollateralToken = collateralAmountUsd.plus(pnlUsd).div(collateralToken.price);
          balanceInCollateralTokenRaw = balanceInCollateralToken.shiftedBy(collateralToken.decimals);
          balanceInProfitToken = _0;
          balanceInProfitTokenRaw = _0;
        }

        const tokenBalance = [
          drillBalance(collateralToken, balanceInCollateralTokenRaw.toString()),
          hasProfit ? drillBalance(profitToken, balanceInProfitTokenRaw.toString()) : null,
        ];

        return {
          ...levTrade,
          tokens: _.compact(tokenBalance),
          balanceUSD: collateralAmountUsd.plus(pnlUsd),
        };
      }),
    );
    return _.compact(contractPositions);
  }
}
