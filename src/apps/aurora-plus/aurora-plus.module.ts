import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AuroraPlusAppDefinition, AURORA_PLUS_DEFINITION } from './aurora-plus.definition';
import { AuroraAuroraPlusBalanceFetcher } from './aurora/aurora-plus.balance-fetcher';
import { AuroraAuroraPlusStakeContractPositionFetcher } from './aurora/aurora-plus.stake.contract-position-fetcher';
import { AuroraPlusContractFactory } from './contracts';

@Register.AppModule({
  appId: AURORA_PLUS_DEFINITION.id,
  providers: [
    AuroraAuroraPlusBalanceFetcher,
    AuroraAuroraPlusStakeContractPositionFetcher,
    AuroraPlusAppDefinition,
    AuroraPlusContractFactory,
  ],
})
export class AuroraPlusAppModule extends AbstractApp() {}
