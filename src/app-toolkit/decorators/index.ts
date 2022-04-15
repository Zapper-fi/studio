import { AppDefinition } from '~app/app.decorator';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.decorator';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.decorator';

import { BalanceFetcher } from './balance-fetcher.decorator';

export const Register = {
  AppDefinition,
  BalanceFetcher,
  ContractPositionFetcher: PositionFetcher(ContractType.POSITION),
  TokenPositionFetcher: PositionFetcher(ContractType.APP_TOKEN),
  TvlFetcher,
};
