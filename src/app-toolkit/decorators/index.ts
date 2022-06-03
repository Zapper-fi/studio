import { AppDefinition, AppModule } from '~app/app.decorator';
import { ContractType } from '~position/contract.interface';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.decorator';
import { PositionFetcher } from '~position/position-fetcher.decorator';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.decorator';

import { BalanceFetcher } from './balance-fetcher.decorator';
import { BalancePresenter } from './balance-presenter.decorator';

export const Register = {
  AppDefinition,
  AppModule,
  BalanceFetcher,
  BalancePresenter,
  ContractPositionFetcher: PositionFetcher(ContractType.POSITION),
  TokenPositionFetcher: PositionFetcher(ContractType.APP_TOKEN),
  ContractPositionBalanceFetcher: PositionBalanceFetcher(ContractType.POSITION),
  TokenPositionBalanceFetcher: PositionBalanceFetcher(ContractType.APP_TOKEN),
  TvlFetcher,
};
