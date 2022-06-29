import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { WithMetaType } from '~position/display.interface';
import { BaseTokenBalance } from '~position/position-balance.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { getPositions } from '../helpers/graph';
import { STRING_SWAP_INTERVALS } from '../helpers/intervals';
import { MEAN_FINANCE_DEFINITION } from '../mean-finance.definition';

const appId = MEAN_FINANCE_DEFINITION.id;
const groupId = MEAN_FINANCE_DEFINITION.groups.dcaPosition.id;
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonMeanFinanceDcaPositionContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions() {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const data = await getPositions(Network.POLYGON_MAINNET, graphHelper);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const positions = data.positions;

    const contractPositions: ContractPosition[] = positions.map(dcaPosition => {
      const toWithdraw = dcaPosition.current.idleSwapped;
      const remainingLiquidity = dcaPosition.current.remainingLiquidity;
      const remainingSwaps = Number(dcaPosition.current.remainingSwaps);
      const swapInterval = Number(dcaPosition.swapInterval.interval) as keyof typeof STRING_SWAP_INTERVALS;
      const rawRate = dcaPosition.current.rate;
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
        label = `Swapping ~${formattedRate} ${from?.symbol || dcaPosition.from.symbol} ${swapIntervalAdverb} to ${
          to?.symbol || dcaPosition.from.symbol
        }`;
      } else {
        label = `Swapping ${from?.symbol || dcaPosition.from.symbol} to ${to?.symbol || dcaPosition.from.symbol}`;
      }
      const secondaryLabel =
        remainingSwaps && STRING_SWAP_INTERVALS[swapInterval]
          ? `${STRING_SWAP_INTERVALS[swapInterval].plural(remainingSwaps)} left`
          : 'Position finished';

      return {
        type: ContractType.POSITION,
        address: dcaPosition.id,
        appId,
        groupId,
        network,
        tokens,
        balanceUSD,
        dataProps: {
          toWithdraw,
          remainingLiquidity,
          remainingSwaps,
          liquidity: balanceUSD,
        },
        displayProps: {
          label,
          secondaryLabel,
          images,
        },
      };
    });

    return contractPositions;
  }
}
