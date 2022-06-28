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
import { Network } from '~types/network.interface';

import { getUserPositions } from '../helpers/graph';
import { STRING_SWAP_INTERVALS } from '../helpers/intervals';
import { MEAN_FINANCE_DEFINITION } from '../mean-finance.definition';

const network = Network.OPTIMISM_MAINNET;

@Register.BalanceFetcher(MEAN_FINANCE_DEFINITION.id, network)
export class OptimismMeanFinanceBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) { }

  async getUserPositions(address: string) {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const data = await getUserPositions(address.toLocaleLowerCase(), Network.OPTIMISM_MAINNET, graphHelper);
    return data.positions;
  }

  async getBalances(address: string) {
    const positions = await this.getUserPositions(address);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const contractPositionBalances: ContractPositionBalance[] = positions.map(dcaPosition => {
      const toWithdraw = dcaPosition.current.idleSwapped;
      const remainingLiquidity = dcaPosition.current.remainingLiquidity;
      const remainingSwaps = dcaPosition.current.remainingSwaps;
      const swapInterval = dcaPosition.swapInterval.interval;

      const from = baseTokens.find(v => v.address === dcaPosition.from.address);
      const to = baseTokens.find(v => v.address === dcaPosition.to.address);

      const tokens: WithMetaType<BaseTokenBalance>[] = [];
      let images: string[] = [];
      if (from) {
        from.network = network;
        tokens.push(drillBalance(from, remainingLiquidity));
        images = [
          ...images,
          ...getImagesFromToken(from),
        ];
      }
      if (to) {
        to.network = network;
        tokens.push(drillBalance(to, toWithdraw));
        images = [
          ...images,
          ...getImagesFromToken(to),
        ];
      }

      const balanceUSD = sumBy(tokens, t => t.balanceUSD);

      const label = `Swapping ${from?.symbol} to ${to?.symbol}`;
      const secondaryLabel = parseInt(remainingSwaps, 10) && STRING_SWAP_INTERVALS[swapInterval] ? `${STRING_SWAP_INTERVALS[swapInterval](remainingSwaps)} left` : 'Position finished';

      return {
        type: ContractType.POSITION,
        address: dcaPosition.id,
        appId: MEAN_FINANCE_DEFINITION.id,
        groupId: MEAN_FINANCE_DEFINITION.groups.dcaPosition.id,
        network,
        tokens,
        balanceUSD,
        dataProps: {
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
    });

    return presentBalanceFetcherResponse([
      {
        label: 'DCA Positions',
        assets: contractPositionBalances,
      },
    ]);
  }
}
