import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CompoundAppModule } from '~apps/compound';

import { AurigamiAppDefinition, AURIGAMI_DEFINITION } from './aurigami.definition';
import { AuroraAurigamiBalanceFetcher } from './aurora/aurigami.balance-fetcher';
import { AuroraAurigamiBorrowContractPositionFetcher } from './aurora/aurigami.borrow.contract-position-fetcher';
import { AuroraAurigamiSupplyTokenFetcher } from './aurora/aurigami.supply.token-fetcher';
import { AuroraAurigamiTvlFetcher } from './aurora/aurigami.tvl-fetcher';
import { AurigamiContractFactory } from './contracts';
import { AurigamiClaimableBalanceHelper } from './helper/aurigami.claimable.balance-helper';

@Register.AppModule({
  appId: AURIGAMI_DEFINITION.id,
  imports: [CompoundAppModule],
  providers: [
    AurigamiAppDefinition,
    AurigamiContractFactory,
    AuroraAurigamiBalanceFetcher,
    AuroraAurigamiBorrowContractPositionFetcher,
    AuroraAurigamiSupplyTokenFetcher,
    AuroraAurigamiTvlFetcher,

    // Helpers
    AurigamiClaimableBalanceHelper,
  ],
})
export class AurigamiAppModule extends AbstractApp() {}
