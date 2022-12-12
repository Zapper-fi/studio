import { constants } from 'ethers';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import type { IMulticallWrapper } from '~multicall/multicall.interface';
import type { AppTokenPosition } from '~position/position.interface';
import type { GetDataPropsParams, GetTokenPropsParams } from '~position/template/app-token.template.types';

import type { ExactlyMarketDefinition } from '../common/exactly.definitions-resolver';
import { ExactlyFixedPositionFetcher } from '../common/exactly.fixed-position-fetcher';
import type { ExactlyFixedMarketProps } from '../common/exactly.fixed-position-fetcher';
import type { ExactlyMarketProps } from '../common/exactly.token-fetcher';
import type { Market } from '../contracts';

@PositionTemplate()
export class EthereumExactlyFixedDepositFetcher extends ExactlyFixedPositionFetcher {
  groupLabel = 'Fixed Deposit';

  getTotalAssets({ definition }: GetTokenPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    return definition.fixedPools.reduce((total, { supplied }) => total.add(supplied), constants.Zero);
  }

  getBestRate({ definition }: GetDataPropsParams<Market, ExactlyFixedMarketProps, ExactlyMarketDefinition>) {
    return definition.fixedPools.reduce(
      (best, { maturity, depositRate: rate }) => (rate.gt(best.rate) ? { maturity, rate } : best),
      { maturity: constants.Zero, rate: constants.Zero },
    );
  }

  async getBalancePerToken({
    address,
    appToken,
    multicall,
  }: {
    address: string;
    appToken: AppTokenPosition;
    multicall: IMulticallWrapper;
  }) {
    const { fixedDepositPositions } = await this.definitionsResolver.getDefinition({
      multicall,
      network: this.network,
      account: address,
      market: appToken.address,
    });
    return fixedDepositPositions.reduce((total, { previewValue }) => total.add(previewValue), constants.Zero);
  }
}
