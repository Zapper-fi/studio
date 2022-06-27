import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { SingleContractFactory } from './contracts';
import { CronosSingleBalanceFetcher } from './cronos/single.balance-fetcher';
import { CronosSingleLendingTokenFetcher } from './cronos/single.lending.token-fetcher';
import { CronosSingleLyfContractPositionFetcher } from './cronos/single.lyf.contract-position-fetcher';
import { SingleAppDefinition, SINGLE_DEFINITION } from './single.definition';

@Register.AppModule({
  appId: SINGLE_DEFINITION.id,
  providers: [
    CronosSingleBalanceFetcher,
    CronosSingleLendingTokenFetcher,
    CronosSingleLyfContractPositionFetcher,
    SingleAppDefinition,
    SingleContractFactory,
  ],
})
export class SingleAppModule extends AbstractApp() {}
