import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';
import { getPositions } from '../helpers/graph';

import { MEAN_FINANCE_DEFINITION } from '../mean-finance.definition';

const appId = MEAN_FINANCE_DEFINITION.id;
const network = Network.POLYGON_MAINNET;

@Register.TvlFetcher({ appId, network })
export class PolygonMeanFinanceTvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) { }

  async getTvl() {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const data = await getPositions(Network.POLYGON_MAINNET, graphHelper);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const positions = data.positions;

    const positionsUSDBalances = positions.map(dcaPosition => {
      const toWithdraw = dcaPosition.current.idleSwapped;
      const remainingLiquidity = dcaPosition.current.remainingLiquidity;

      const from = baseTokens.find(v => v.address === dcaPosition.from.address)!;
      const to = baseTokens.find(v => v.address === dcaPosition.to.address)!;
      try {
        from.network = network;
        to.network = network;
      } catch {
        console.log('did not find token', from, to, dcaPosition.from, dcaPosition.to)
      }


      const tokens = [drillBalance(from, remainingLiquidity), drillBalance(to, toWithdraw)];
      const balanceUSD = sumBy(tokens, t => t.balanceUSD);

      return balanceUSD;
    });

    return positionsUSDBalances.reduce((acc, positionUSDBalance) => acc + positionUSDBalance, 0)
  }
}
