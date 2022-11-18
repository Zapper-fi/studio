import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { LemmafinanceContractFactory } from './contracts';
import { LemmafinanceAppDefinition, LEMMAFINANCE_DEFINITION } from './lemmafinance.definition';
import { OptimismLemmafinanceUsdlTokenFetcher } from './optimism/lemmafinance.usdl.token-fetcher';

@Register.AppModule({
  appId: LEMMAFINANCE_DEFINITION.id,
  providers: [LemmafinanceAppDefinition, LemmafinanceContractFactory, OptimismLemmafinanceUsdlTokenFetcher],
})
export class LemmafinanceAppModule extends AbstractApp() {}
