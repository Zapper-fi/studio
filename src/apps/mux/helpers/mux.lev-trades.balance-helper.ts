import { Inject, Injectable } from '@nestjs/common';
import Axios, { AxiosInstance } from 'axios';
import _ from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { formatMetaBaseData, getCollateralTokensByNetwork, getMarketTokensByNetwork } from '~apps/mux/helpers/common';
import { Network, NETWORK_IDS } from '~types/network.interface';

import { MuxContractFactory } from '../contracts';
import MUX_DEFINITION from '../mux.definition';

export type MuxLevTradesContractPositionDataProps = {
  collateralTokenSymbol: string;
  marketTokenSymbol: string;
  isLong: boolean;
};

type GetLevTradesContractPositionHelperParams = {
  network: Network;
  address: string;
};

@Injectable()
export class MuxLevTradesBalanceHelper {
  private axios: AxiosInstance = Axios.create({
    baseURL: 'https://app.mux.network',
  });

  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MuxContractFactory) private readonly contractFactory: MuxContractFactory,
  ) {}

  async getBalance({ address, network }: GetLevTradesContractPositionHelperParams) {
    const parameter = `[{"type":"id","value":"${address.toLowerCase()}","target":["variable",["template-tag","trader"]],"id":"14ef4983"}]`
    const pathUrl = `/metabase/api/public/dashboard/5fe8cebe-328e-4334-8fb3-52c98fc8ef71/dashcard/128/card/92?parameters=${encodeURIComponent(
      parameter,
    )}`;
    const { data } = await this.axios.get(pathUrl);
    const positions = formatMetaBaseData(data.data.cols, data.data.rows);

    const levTrades = await this.appToolkit.getAppContractPositions<MuxLevTradesContractPositionDataProps>({
      appId: MUX_DEFINITION.id,
      groupIds: [MUX_DEFINITION.groups.levTrades.id],
      network,
    });

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const marketTokens = await getMarketTokensByNetwork(network, this.appToolkit);
    const collateralTokens = await getCollateralTokensByNetwork(network, this.appToolkit);
    const contractPositions = levTrades.map(levTrade => {
      const collateralTokenSymbol = levTrade.dataProps.collateralTokenSymbol;
      const marketTokenSymbol = levTrade.dataProps.marketTokenSymbol;
      const isLong = levTrade.dataProps.isLong;

      const position = positions.find(
        item =>
          item.asset === marketTokenSymbol &&
          item.collateral_token === collateralTokenSymbol &&
          item.is_long === isLong &&
          item.chain_id === NETWORK_IDS[network],
      );
      if (!position) return;
      const collateralToken = collateralTokens.find(x => x.symbol == collateralTokenSymbol);
      const hasProfit = position.upnl > 0;
      const profitToken = isLong
        ? marketTokens.find(x => x.symbol == marketTokenSymbol)
        : baseTokens.find(x => x.symbol == 'USDC');
      if (!profitToken || !collateralToken) return;

      let balanceInCollateralToken = position.collateral_usd / collateralToken.price;
      let balanceInCollateralTokenRaw = balanceInCollateralToken * 10 ** collateralToken.decimals;
      let balanceInProfitToken = position.upnl / profitToken.price;
      let balanceInProfitTokenRaw = balanceInProfitToken * 10 ** profitToken.decimals;

      if (!hasProfit) {
        balanceInCollateralToken = (position.collateral_usd + position.upnl) / collateralToken.price;
        balanceInCollateralTokenRaw = balanceInCollateralToken * 10 ** collateralToken.decimals;
        balanceInProfitToken = 0;
        balanceInProfitTokenRaw = 0;
      }

      const tokenBalance = [
        drillBalance(collateralToken, balanceInCollateralTokenRaw.toString()),
        hasProfit ? drillBalance(profitToken, balanceInProfitTokenRaw.toString()) : null,
      ];

      return {
        ...levTrade,
        tokens: _.compact(tokenBalance),
        balanceUSD: position.collateral_usd + position.upnl,
      };
    });
    return _.compact(contractPositions);
  }
}
