import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import _, { sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { getOpenOrdersByUser } from '../helpers/graph';
import { SYMPHONY_DEFINITION } from '../symphony.definition';

const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(SYMPHONY_DEFINITION.id, network)
export class PolygonSymphonyBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getUserPositions(address: string) {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const data = await getOpenOrdersByUser(address.toLocaleLowerCase(), Network.POLYGON_MAINNET, graphHelper);
    return data.orders;
  }

  async getBalances(address: string) {
    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: SYMPHONY_DEFINITION.id,
      network,
      groupIds: [SYMPHONY_DEFINITION.groups.yolo.id],
    });

    const positions = await this.getUserPositions(address);

    const contractPositionBalances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const position = positions.filter(
          p => p.inputToken.toLocaleLowerCase() === contractPosition.address.toLocaleLowerCase(),
        )!;

        if (position) {
          const claimableToken = contractPosition.tokens.find(isSupplied)!;
          const totalSupplied = position.reduce(
            (partialSum, a) => partialSum.plus(new BigNumber(a.inputAmount)),
            new BigNumber(0),
          );
          const suppliedTokenBalance = drillBalance(claimableToken, totalSupplied.toString());
          const tokens = [suppliedTokenBalance].filter(v => v.balanceUSD > 0);
          const balanceUSD = sumBy(tokens, t => t.balanceUSD);
          return { ...contractPosition, tokens, balanceUSD };
        }
      }),
    );

    return presentBalanceFetcherResponse([
      {
        label: 'Orders',
        assets: _.reject(contractPositionBalances, _.isUndefined),
      },
    ]);
  }
}
