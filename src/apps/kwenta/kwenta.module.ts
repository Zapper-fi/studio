import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { KwentaContractFactory } from './contracts';
import { KwentaAppDefinition, KWENTA_DEFINITION } from './kwenta.definition';
import { OptimismKwentaIsolatedMarginContractPositionFetcher } from './optimism/kwenta.isolated.margin-position-fetcher';
import { OptimismKwentaCrossMarginContractPositionFetcher } from './optimism/kwenta.cross.margin-position-fetcher';

@Register.AppModule({
  appId: KWENTA_DEFINITION.id,
  providers: [KwentaAppDefinition, KwentaContractFactory, OptimismKwentaIsolatedMarginContractPositionFetcher, OptimismKwentaCrossMarginContractPositionFetcher],
})
export class KwentaAppModule extends AbstractApp() { }
