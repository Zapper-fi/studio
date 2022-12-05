import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { TarotContractFactory } from './contracts';
import { FantomTarotBorrowContractPositionFetcher } from './fantom/tarot.borrow.contract-position-fetcher';
import { FantomTarotSupplyTokenFetcher } from './fantom/tarot.supply.token-fetcher';
import { FantomTarotVaultTokenFetcher } from './fantom/tarot.vault.token-fetcher';
import { TarotAppDefinition, TAROT_DEFINITION } from './tarot.definition';

@Register.AppModule({
  appId: TAROT_DEFINITION.id,
  providers: [
    TarotAppDefinition,
    TarotContractFactory,
    FantomTarotBorrowContractPositionFetcher,
    FantomTarotSupplyTokenFetcher,
    FantomTarotVaultTokenFetcher,
  ],
})
export class TarotAppModule extends AbstractApp() {}
