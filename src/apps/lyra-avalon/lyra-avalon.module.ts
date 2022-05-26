import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { LyraAvalonContractFactory } from './contracts';
import { LyraAvalonAppDefinition, LYRA_AVALON_DEFINITION } from './lyra-avalon.definition';
import { OptimismLyraAvalonBalanceFetcher } from './optimism/lyra-avalon.balance-fetcher';
import { OptimismLyraAvalonOptionsContractPositionFetcher } from './optimism/lyra-avalon.options.contract-position-fetcher';

@Register.AppModule({
  appId: LYRA_AVALON_DEFINITION.id,
  providers: [
    LyraAvalonAppDefinition,
    LyraAvalonContractFactory,
    OptimismLyraAvalonBalanceFetcher,
    OptimismLyraAvalonOptionsContractPositionFetcher,
  ],
})
export class LyraAvalonAppModule extends AbstractApp() {}
