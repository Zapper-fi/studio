import { AppDefinition, AppModule } from '~app/app.decorator';

import { BalanceFetcher } from './balance-fetcher.decorator';
import { PositionTemplate } from './position-template.decorator';
import { PresenterTemplate } from './presenter-template.decorator';

export const Register = {
  AppDefinition,
  AppModule,
  BalanceFetcher,
  PositionTemplate,
  PresenterTemplate,
};
