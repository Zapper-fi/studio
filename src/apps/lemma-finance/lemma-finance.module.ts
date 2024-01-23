import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { LemmaFinanceViemContractFactory } from './contracts';
import { OptimismLemmaFinanceSynthTokenFetcher } from './optimism/lemma-finance.synth.token-fetcher';
import { OptimismLemmaFinanceUsdlTokenFetcher } from './optimism/lemma-finance.usdl.token-fetcher';
import { OptimismLemmaFinanceXSynthTokenFetcher } from './optimism/lemma-finance.x-synth.token-fetcher';

@Module({
  providers: [
    LemmaFinanceViemContractFactory,
    // Optimism
    OptimismLemmaFinanceSynthTokenFetcher,
    OptimismLemmaFinanceUsdlTokenFetcher,
    OptimismLemmaFinanceXSynthTokenFetcher,
  ],
})
export class LemmaFinanceAppModule extends AbstractApp() {}
