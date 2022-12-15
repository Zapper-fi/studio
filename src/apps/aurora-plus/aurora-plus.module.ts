import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AuroraPlusAppDefinition, AURORA_PLUS_DEFINITION } from './aurora-plus.definition';
import { AuroraAuroraPlusStakeContractPositionFetcher } from './aurora/aurora-plus.stake.contract-position-fetcher';
import { AuroraPlusContractFactory } from './contracts';

@Register.AppModule({
  appId: AURORA_PLUS_DEFINITION.id,
  providers: [
    AuroraPlusAppDefinition,
    AuroraPlusContractFactory,
    // Aurora
    AuroraAuroraPlusStakeContractPositionFetcher,
  ],
})
export class AuroraPlusAppModule extends AbstractApp() {}
