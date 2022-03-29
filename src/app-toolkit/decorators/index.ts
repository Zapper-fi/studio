import { AppDefinition } from '~app/app-definition.decorator';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.decorator';

import { BalanceFetcher } from './balance-fetcher.decorator';

export const Register = {
  AppDefinition,
  BalanceFetcher,
  ContractPositionFetcher: PositionFetcher(ContractType.POSITION),
  TokenPositionFetcher: PositionFetcher(ContractType.APP_TOKEN),
};
