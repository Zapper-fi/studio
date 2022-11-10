import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { KwentaContractFactory } from './contracts';
import { KwentaAppDefinition, KWENTA_DEFINITION } from './kwenta.definition';
import { OptimismKwentaCrossContractPositionFetcher } from './optimism/kwenta.cross.contract-position-fetcher';
import { OptimismKwentaIsolatedContractPositionFetcher } from './optimism/kwenta.isolated.contract-position-fetcher';

@Register.AppModule({
  appId: KWENTA_DEFINITION.id,
  providers: [
    KwentaAppDefinition,
    KwentaContractFactory,
    OptimismKwentaIsolatedContractPositionFetcher,
    OptimismKwentaCrossContractPositionFetcher,
  ],
})
export class KwentaAppModule extends AbstractApp() {}
