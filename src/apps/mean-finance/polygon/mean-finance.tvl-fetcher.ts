import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { WithMetaType } from '~position/display.interface';
import { BaseTokenBalance } from '~position/position-balance.interface';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { MetaType } from '~position/position.interface';
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

      const from = baseTokens.find(v => v.address === dcaPosition.from.address);
      const to = baseTokens.find(v => v.address === dcaPosition.to.address);

      const tokens: WithMetaType<BaseTokenBalance>[] = [];
      if (from) {
        from.network = network;
        tokens.push(drillBalance(from, remainingLiquidity));
      }
      if (to) {
        to.network = network;
        tokens.push({
          ...drillBalance(to, toWithdraw),
          metaType: MetaType.CLAIMABLE,
        });
      }

      const balanceUSD = sumBy(tokens, t => t.balanceUSD);

      return balanceUSD;
    });

    return positionsUSDBalances.reduce((acc, positionUSDBalance) => acc + positionUSDBalance, 0)
  }
}
