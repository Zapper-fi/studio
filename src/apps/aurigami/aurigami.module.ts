import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AurigamiAppDefinition, AURIGAMI_DEFINITION } from './aurigami.definition';
import { AuroraAurigamiBorrowContractPositionFetcher } from './aurora/aurigami.borrow.contract-position-fetcher';
import { AuroraAurigamiClaimableContractPositionFetcher } from './aurora/aurigami.claimable.contract-position-fetcher';
import { AuroraAurigamiPositionPresenter } from './aurora/aurigami.position-presenter';
import { AuroraAurigamiSupplyTokenFetcher } from './aurora/aurigami.supply.token-fetcher';
import { AurigamiContractFactory } from './contracts';

@Register.AppModule({
  appId: AURIGAMI_DEFINITION.id,
  providers: [
    AurigamiAppDefinition,
    AurigamiContractFactory,
    AuroraAurigamiBorrowContractPositionFetcher,
    AuroraAurigamiClaimableContractPositionFetcher,
    AuroraAurigamiPositionPresenter,
    AuroraAurigamiSupplyTokenFetcher,
  ],
})
export class AurigamiAppModule extends AbstractApp() {}
