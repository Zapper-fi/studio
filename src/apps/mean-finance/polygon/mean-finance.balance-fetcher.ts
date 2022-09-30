import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { ContractType } from '~position/contract.interface';
import { WithMetaType } from '~position/display.interface';
import { BaseTokenBalance, ContractPositionBalance } from '~position/position-balance.interface';
import { claimable } from '~position/position.utils';
import { Network } from '~types/network.interface';
import { HUB_ADDRESS, POSITIONS_VERSIONS, PositionVersions } from '../helpers/addresses';

import { getUserPositions } from '../helpers/graph';
import { STRING_SWAP_INTERVALS } from '../helpers/intervals';
import { MEAN_FINANCE_DEFINITION } from '../mean-finance.definition';

const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(MEAN_FINANCE_DEFINITION.id, network)
export class PolygonMeanFinanceBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) { }

  async getUserPositions(address: string, version: PositionVersions) {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const data = await getUserPositions(address.toLocaleLowerCase(), Network.POLYGON_MAINNET, graphHelper, version);
    return data.positions;
  }

  async getBalanceForVersion(address: string, version: PositionVersions) {
    const positions = await this.getUserPositions(address, version);
    const dcaHubAddress = HUB_ADDRESS[version][network];

    if (!dcaHubAddress) {
      return Promise.resolve([]);
    }

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    return positions.map(dcaPosition => {
      const toWithdraw = dcaPosition.toWithdraw;
      const remainingLiquidity = dcaPosition.remainingLiquidity;
      const remainingSwaps = Number(dcaPosition.remainingSwaps);
      const swapInterval = Number(dcaPosition.swapInterval.interval) as keyof typeof STRING_SWAP_INTERVALS;
      const rawRate = dcaPosition.rate;
      const rate = Number(rawRate) / 10 ** Number(dcaPosition.from.decimals);
      let formattedRate = rate.toFixed(3);

      if (rate < 0.001) {
        formattedRate = '<0.001';
      }

      const from = baseTokens.find(v => v.address === dcaPosition.from.address);
      const to = baseTokens.find(v => v.address === dcaPosition.to.address);

      const tokens: WithMetaType<BaseTokenBalance>[] = [];
      let images: string[] = [];
      if (from) {
        from.network = network;
        tokens.push(drillBalance(from, remainingLiquidity));
        images = [...images, ...getImagesFromToken(from)];
      }
      if (to) {
        to.network = network;
        tokens.push(drillBalance(claimable(to), toWithdraw));
        images = [...images, ...getImagesFromToken(to)];
      }

      const balanceUSD = sumBy(tokens, t => t.balanceUSD);
      const swapIntervalAdverb = STRING_SWAP_INTERVALS[swapInterval].adverb;
      let label = '';

      if (remainingSwaps > 0) {
        label = `Swapping ~${formattedRate} ${from?.symbol || dcaPosition.from.symbol} ${swapIntervalAdverb} to ${to?.symbol || dcaPosition.from.symbol
          }`;
      } else {
        label = `Swapping ${from?.symbol || dcaPosition.from.symbol} to ${to?.symbol || dcaPosition.from.symbol}`;
      }
      const secondaryLabel =
        remainingSwaps && STRING_SWAP_INTERVALS[swapInterval]
          ? `${STRING_SWAP_INTERVALS[swapInterval].plural(remainingSwaps)} left`
          : 'Position finished';

      const position: ContractPositionBalance = {
        type: ContractType.POSITION,
        address: dcaHubAddress,
        appId: MEAN_FINANCE_DEFINITION.id,
        groupId: MEAN_FINANCE_DEFINITION.groups.dcaPosition.id,
        network,
        tokens,
        balanceUSD,
        dataProps: {
          id: `${dcaPosition.id}-v${version}`,
          positionId: dcaPosition.id,
          toWithdraw,
          remainingLiquidity,
          remainingSwaps,
          totalValueLocked: balanceUSD,
        },
        displayProps: {
          label,
          secondaryLabel,
          images,
        },
      };

      position.key = this.appToolkit.getPositionKey(position, ['id']);
      return position;
    });
  }

  async getBalances(address: string) {
    const positionResults = await Promise.all(POSITIONS_VERSIONS.map(version => this.getBalanceForVersion(address, version)));

    const contractPositionBalances: ContractPositionBalance[] = positionResults.reduce((acc, positionBalances) => [...acc, ...positionBalances], []);

    return presentBalanceFetcherResponse([
      {
        label: 'DCA Positions',
        assets: contractPositionBalances,
      },
    ]);
  }
}
