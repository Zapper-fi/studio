import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { LemmaFinanceViemContractFactory } from './contracts';
import { OptimismLemmaFinanceSynthTokenFetcher } from './optimism/lemma-finance.synth.token-fetcher';
import { OptimismLemmaFinanceUsdlTokenFetcher } from './optimism/lemma-finance.usdl.token-fetcher';
import { OptimismLemmaFinanceXSynthTokenFetcher } from './optimism/lemma-finance.x-synth.token-fetcher';
import { OptimismLemmaFinanceXUsdlTokenFetcher } from './optimism/lemma-finance.x-usdl.token-fetcher';

@Module({
  providers: [
    LemmaFinanceContractFactory,
    // Optimism
    OptimismLemmaFinanceSynthTokenFetcher,
    OptimismLemmaFinanceUsdlTokenFetcher,
    OptimismLemmaFinanceXSynthTokenFetcher,
    OptimismLemmaFinanceXUsdlTokenFetcher,
  ],
})
export class LemmaFinanceAppModule extends AbstractApp() {}
