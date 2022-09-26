import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { TectonicContractFactory } from './contracts';
import { CronosTectonicBorrowContractPositionFetcher } from './cronos/tectonic.borrow.contract-position-fetcher';
import { CronosTectonicPositionPresenter } from './cronos/tectonic.position-presenter';
import { CronosTectonicSupplyTokenFetcher } from './cronos/tectonic.supply.token-fetcher';
import { CronosTectonicXTonicTokenFetcher } from './cronos/tectonic.xtonic.token-fetcher';
import { TectonicAppDefinition, TECTONIC_DEFINITION } from './tectonic.definition';

@Register.AppModule({
  appId: TECTONIC_DEFINITION.id,
  providers: [
    CronosTectonicBorrowContractPositionFetcher,
    CronosTectonicSupplyTokenFetcher,
    CronosTectonicXTonicTokenFetcher,
    CronosTectonicPositionPresenter,
    TectonicAppDefinition,
    TectonicContractFactory,
  ],
})
export class TectonicAppModule extends AbstractApp() {}
