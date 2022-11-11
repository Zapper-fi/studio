import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { LyraAvalonContractFactory } from './contracts';
import { LyraAvalonAppDefinition, LYRA_AVALON_DEFINITION } from './lyra-avalon.definition';
import { OptimismLyraAvalonOptionsContractPositionFetcher } from './optimism/lyra-avalon.options.contract-position-fetcher';
import { OptimismLyraAvalonPoolTokenFetcher } from './optimism/lyra-avalon.pool.token-fetcher';
import { OptimismLyraAvalonStakingContractPositionFetcher } from './optimism/lyra-avalon.staking.contract-position-fetcher';
import { OptimismLyraAvalonStkLyraClaimableContractPositionFetcher } from './optimism/lyra-avalon.stk-lyra-claimable.contract-position-fetcher';
import { OptimismLyraAvalonStkLyraTokenFetcher } from './optimism/lyra-avalon.stk-lyra.token-fetcher';

@Register.AppModule({
  appId: LYRA_AVALON_DEFINITION.id,
  providers: [
    LyraAvalonAppDefinition,
    LyraAvalonContractFactory,
    OptimismLyraAvalonOptionsContractPositionFetcher,
    OptimismLyraAvalonPoolTokenFetcher,
    OptimismLyraAvalonStakingContractPositionFetcher,
    OptimismLyraAvalonStkLyraTokenFetcher,
    OptimismLyraAvalonStkLyraClaimableContractPositionFetcher,
  ],
})
export class LyraAvalonAppModule extends AbstractApp() {}
