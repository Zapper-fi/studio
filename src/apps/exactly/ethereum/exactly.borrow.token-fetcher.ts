import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import type { IMulticallWrapper } from '~multicall/multicall.interface';
import type { AppTokenPosition } from '~position/position.interface';
import type { GetDataPropsParams, GetTokenPropsParams } from '~position/template/app-token.template.types';

import type { ExactlyMarketDefinition } from '../common/exactly.definitions-resolver';
import { ExactlyTokenFetcher } from '../common/exactly.token-fetcher';
import type { ExactlyMarketProps } from '../common/exactly.token-fetcher';
import type { Market } from '../contracts';

@PositionTemplate()
export class EthereumExactlyBorrowFetcher extends ExactlyTokenFetcher {
  groupLabel = 'Fixed Borrow';
  isDebt = true;

  getSupply({ definition }: GetTokenPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    return Promise.resolve(definition.totalFloatingBorrowShares);
  }

  getTotalAssets({ definition }: GetTokenPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    return definition.totalFloatingBorrowAssets;
  }

  getApr({ definition }: GetDataPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    return Number(definition.floatingBorrowRate) / 1e18;
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
    const { floatingBorrowShares } = await this.definitionsResolver.getDefinition({
      multicall,
      network: this.network,
      account: address,
      market: appToken.address,
    });
    return floatingBorrowShares;
  }
}
