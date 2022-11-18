import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { LemmafinanceContractFactory } from './contracts';
import { LemmafinanceAppDefinition, LEMMAFINANCE_DEFINITION } from './lemmafinance.definition';
import { OptimismLemmafinanceBalanceFetcher } from './optimism/lemmafinance.balance-fetcher';
import { OptimismLemmafinanceLemmaSynthTokenFetcher } from './optimism/lemmafinance.LemmaSynth.token-fetcher';
import { OptimismLemmafinanceUsdlTokenFetcher } from './optimism/lemmafinance.usdl.token-fetcher';
import { OptimismLemmafinanceXusdlTokenFetcher } from './optimism/lemmafinance.xusdl.token-fetcher';

@Register.AppModule({
  appId: LEMMAFINANCE_DEFINITION.id,
  providers: [
    LemmafinanceAppDefinition,
    LemmafinanceContractFactory,
    OptimismLemmafinanceBalanceFetcher,
    OptimismLemmafinanceLemmaSynthTokenFetcher,
    OptimismLemmafinanceUsdlTokenFetcher,
    OptimismLemmafinanceXusdlTokenFetcher,
  ],
})
export class LemmafinanceAppModule extends AbstractApp() {}
