import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CompoundAppModule } from '~apps/compound/compound.module';

import { TarotContractFactory } from './contracts';
import { FantomTarotBalanceFetcher } from './fantom/tarot.balance-fetcher';
import { FantomTarotBorrowContractPositionFetcher } from './fantom/tarot.borrow.contract-position-fetcher';
import { FantomTarotCollateralTokenFetcher } from './fantom/tarot.collateral.token-fetcher';
import { FantomTarotSupplyTokenFetcher } from './fantom/tarot.supply.token-fetcher';
import { FantomTarotVaultTokenFetcher } from './fantom/tarot.vault.token-fetcher';
import { TarotAppDefinition, TAROT_DEFINITION } from './tarot.definition';

@Register.AppModule({
  appId: TAROT_DEFINITION.id,
  imports: [CompoundAppModule],
  providers: [
    TarotAppDefinition,
    TarotContractFactory,
    FantomTarotBalanceFetcher,
    FantomTarotBorrowContractPositionFetcher,
    FantomTarotCollateralTokenFetcher,
    FantomTarotSupplyTokenFetcher,
    FantomTarotVaultTokenFetcher,
  ],
})
export class TarotAppModule extends AbstractApp() {}
