import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { LyraAvalonContractFactory } from './contracts';
import { LyraAvalonAppDefinition, LYRA_AVALON_DEFINITION } from './lyra-avalon.definition';
import { OptimismLyraAvalonBalanceFetcher } from './optimism/lyra-avalon.balance-fetcher';
import { OptimismLyraAvalonOptionsContractPositionFetcher } from './optimism/lyra-avalon.options.contract-position-fetcher';
import { OptimismLyraAvalonPoolTokenFetcher } from './optimism/lyra-avalon.pool.token-fetcher';
import { OptimismLyraAvalonAddressHelper } from './optimism/helpers/lyra-avalon.address-helper'

@Register.AppModule({
  appId: LYRA_AVALON_DEFINITION.id,
  providers: [
    LyraAvalonAppDefinition,
    LyraAvalonContractFactory,
    OptimismLyraAvalonAddressHelper,
    OptimismLyraAvalonBalanceFetcher,
    OptimismLyraAvalonOptionsContractPositionFetcher,
    OptimismLyraAvalonPoolTokenFetcher,
  ],
})
export class LyraAvalonAppModule extends AbstractApp() { }
