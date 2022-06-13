import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CompoundAppModule } from '~apps/compound';

import { AurigamiAppDefinition, AURIGAMI_DEFINITION } from './aurigami.definition';
import { AuroraAurigamiBorrowContractPositionFetcher } from './aurora/aurigami.borrow.contract-position-fetcher';
import { AuroraAurigamiSupplyTokenFetcher } from './aurora/aurigami.supply.token-fetcher';
import { AurigamiContractFactory } from './contracts';

@Register.AppModule({
  appId: AURIGAMI_DEFINITION.id,
  imports: [CompoundAppModule],
  providers: [
    AurigamiAppDefinition,
    AurigamiContractFactory,
    AuroraAurigamiBorrowContractPositionFetcher,
    AuroraAurigamiSupplyTokenFetcher,
  ],
})
export class AurigamiAppModule extends AbstractApp() {}
