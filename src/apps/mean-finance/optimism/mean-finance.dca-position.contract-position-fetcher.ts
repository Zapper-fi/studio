import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MeanFinanceContractFactory } from '../contracts';
import { getPositions } from '../helpers/graph';
import { STRING_SWAP_INTERVALS } from '../helpers/intervals';
import { MEAN_FINANCE_DEFINITION } from '../mean-finance.definition';

const appId = MEAN_FINANCE_DEFINITION.id;
const groupId = MEAN_FINANCE_DEFINITION.groups.dcaPosition.id;
const network = Network.OPTIMISM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismMeanFinanceDcaPositionContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MeanFinanceContractFactory) private readonly meanFinanceContractFactory: MeanFinanceContractFactory,
  ) { }

  async getPositions() {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const data = await getPositions(Network.OPTIMISM_MAINNET, graphHelper);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const positions = data.positions;

    const contractPositions: ContractPosition[] = positions.map(dcaPosition => {
      const toWithdraw = dcaPosition.current.idleSwapped;
      const remainingLiquidity = dcaPosition.current.remainingLiquidity;
      const remainingSwaps = dcaPosition.current.remainingSwaps;
      const swapInterval = dcaPosition.swapInterval.interval;

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

      const label = `Swapping ${from?.symbol} to ${to?.symbol}`;
      const secondaryLabel = parseInt(remainingSwaps, 10) && STRING_SWAP_INTERVALS[swapInterval] ? `${STRING_SWAP_INTERVALS[swapInterval](remainingSwaps)} left` : 'Position finished';

      const imagesFrom = getImagesFromToken(from);
      const imagesTo = getImagesFromToken(to);

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
          images: [...imagesFrom, ...imagesTo],
        },
      };
    });

    return contractPositions;
  }
}
