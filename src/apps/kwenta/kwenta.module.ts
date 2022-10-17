import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { KwentaContractFactory } from './contracts';
import { KwentaAppDefinition, KWENTA_DEFINITION } from './kwenta.definition';
import { OptimismKwentaPerpContractPositionFetcher } from './optimism/kwenta.perp.contract-position-fetcher';

@Register.AppModule({
  appId: KWENTA_DEFINITION.id,
  providers: [KwentaAppDefinition, KwentaContractFactory, OptimismKwentaPerpContractPositionFetcher],
})
export class KwentaAppModule extends AbstractApp() {}
