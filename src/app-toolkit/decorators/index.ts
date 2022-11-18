import { AppDefinition, AppModule } from '~app/app.decorator';
import { ContractType } from '~position/contract.interface';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.decorator';
import { PositionFetcher } from '~position/position-fetcher.decorator';

import { BalanceFetcher } from './balance-fetcher.decorator';
import { BalanceProductMeta } from './balance-product-meta.decorator';
import { PositionTemplate } from './position-template.decorator';
import { PresenterTemplate } from './presenter-template.decorator';

export const Register = {
  AppDefinition,
  AppModule,
  BalanceFetcher,
  BalanceProductMeta,
  ContractPositionBalanceFetcher: PositionBalanceFetcher(ContractType.POSITION),
  ContractPositionFetcher: PositionFetcher(ContractType.POSITION),
  PositionTemplate,
  PresenterTemplate,
  TokenPositionBalanceFetcher: PositionBalanceFetcher(ContractType.APP_TOKEN),
  TokenPositionFetcher: PositionFetcher(ContractType.APP_TOKEN),
};
