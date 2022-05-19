import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { TarotContractFactory } from './contracts';
import { FantomTarotBalanceFetcher } from './fantom/tarot.balance-fetcher';
import { FantomTarotBorrowContractPositionFetcher } from './fantom/tarot.borrow.contract-position-fetcher';
import { FantomTarotCollateralTokenFetcher } from './fantom/tarot.collateral.token-fetcher';
import { FantomTarotSupplyVaultTokenFetcher } from './fantom/tarot.supply-vault.token-fetcher';
import { FantomTarotSupplyTokenFetcher } from './fantom/tarot.supply.token-fetcher';
import { CompoundBorrowContractPositionHelper } from './helper/compound.borrow.contract-position-helper';
import { CompoundLendingBalanceHelper } from './helper/compound.lending.balance-helper';
import { CompoundSupplyTokenHelper } from './helper/compound.supply.token-helper';
import { TarotAppDefinition, TAROT_DEFINITION } from './tarot.definition';

@Register.AppModule({
  appId: TAROT_DEFINITION.id,
  providers: [
    TarotAppDefinition,
    TarotContractFactory,
    FantomTarotBalanceFetcher,
    FantomTarotBorrowContractPositionFetcher,
    FantomTarotCollateralTokenFetcher,
    FantomTarotSupplyTokenFetcher,
    FantomTarotSupplyVaultTokenFetcher,
    // Helpers (Remove when Compound is migrated to Studio)
    CompoundLendingBalanceHelper,
    CompoundSupplyTokenHelper,
    CompoundBorrowContractPositionHelper,
  ],
})
export class TarotAppModule extends AbstractApp() {}
