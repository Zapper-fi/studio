import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CompoundAppModule } from '~apps/compound';

import { TectonicContractFactory } from './contracts';
import { CronosTectonicBalanceFetcher } from './cronos/tectonic.balance-fetcher';
import { CronosTectonicBorrowContractPositionFetcher } from './cronos/tectonic.borrow.contract-position-fetcher';
import { CronosTectonicSupplyTokenFetcher } from './cronos/tectonic.supply.token-fetcher';
import { CronosTectonicTvlFetcher } from './cronos/tectonic.tvl-fetcher';
import { TectonicClaimableBalanceHelper } from './helper/tectonic.claimable.balance-helper';
import { TectonicBorrowBalanceHelper } from './helper/tectonic.borrow.balance-helper';
import { TectonicSupplyTokenHelper } from './helper/tectonic.supply.token-helper';
import { TectonicSupplyBalanceHelper } from './helper/tectonic.supply.balance-helper';
import { TectonicAppDefinition, TECTONIC_DEFINITION } from './tectonic.definition';

@Register.AppModule({
  appId: TECTONIC_DEFINITION.id,
  imports: [CompoundAppModule],
  providers: [
    CronosTectonicBalanceFetcher,
    CronosTectonicBorrowContractPositionFetcher,
    CronosTectonicSupplyTokenFetcher,
    CronosTectonicTvlFetcher,
    TectonicAppDefinition,
    TectonicContractFactory,
    TectonicClaimableBalanceHelper,
    TectonicBorrowBalanceHelper,
    TectonicSupplyTokenHelper,
    TectonicSupplyBalanceHelper,
    TectonicContractFactory,
  ],
  exports: [
    TectonicClaimableBalanceHelper,
    TectonicBorrowBalanceHelper,
    TectonicSupplyTokenHelper,
    TectonicSupplyBalanceHelper,
    TectonicContractFactory,
  ],
})
export class TectonicAppModule extends AbstractApp() {}
