import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { FurucomboContractFactory } from './contracts';
import { FurucomboAppDefinition, FURUCOMBO_DEFINITION } from './furucombo.definition';
import { PolygonFurucomboFundTokenFetcher } from './polygon/furucombo.fund.token-fetcher';

@Register.AppModule({
  appId: FURUCOMBO_DEFINITION.id,
  providers: [FurucomboAppDefinition, FurucomboContractFactory, PolygonFurucomboFundTokenFetcher],
})
export class FurucomboAppModule extends AbstractApp() {}
