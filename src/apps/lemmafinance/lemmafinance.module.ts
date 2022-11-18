import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { LemmafinanceContractFactory } from './contracts';
import { LemmafinanceAppDefinition, LEMMAFINANCE_DEFINITION } from './lemmafinance.definition';
import { OptimismLemmafinanceBalanceFetcher } from './optimism/lemmafinance.balance-fetcher';
import { OptimismLemmafinanceUsdlTokenFetcher } from './optimism/lemmafinance.usdl.token-fetcher';

@Register.AppModule({
  appId: LEMMAFINANCE_DEFINITION.id,
  providers: [
    LemmafinanceAppDefinition,
    LemmafinanceContractFactory,
    OptimismLemmafinanceBalanceFetcher,
    OptimismLemmafinanceUsdlTokenFetcher,
  ],
})
export class LemmafinanceAppModule extends AbstractApp() {}
