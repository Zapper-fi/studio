import { AppDefinition, AppModule } from '~app/app.decorator';
import { ContractType } from '~position/contract.interface';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.decorator';
import { PositionFetcher } from '~position/position-fetcher.decorator';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.decorator';

import { BalanceAfterware } from './balance-afterware.decorator';
import { BalanceFetcher } from './balance-fetcher.decorator';

export const Register = {
  AppDefinition,
  AppModule,
  BalanceAfterware,
  BalanceFetcher,
  ContractPositionFetcher: PositionFetcher(ContractType.POSITION),
  TokenPositionFetcher: PositionFetcher(ContractType.APP_TOKEN),
  ContractPositionBalanceFetcher: PositionBalanceFetcher(ContractType.POSITION),
  TokenPositionBalanceFetcher: PositionBalanceFetcher(ContractType.APP_TOKEN),
  TvlFetcher,
};
