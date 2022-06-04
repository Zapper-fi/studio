import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { SynthetixAppModule } from '~apps/synthetix';

import { LyraAvalonContractFactory } from './contracts';
import { LyraAvalonAppDefinition, LYRA_AVALON_DEFINITION } from './lyra-avalon.definition';
import { OptimismLyraAvalonBalanceFetcher } from './optimism/lyra-avalon.balance-fetcher';
import { OptimismLyraAvalonOptionsContractPositionFetcher } from './optimism/lyra-avalon.options.contract-position-fetcher';
import { OptimismLyraAvalonPoolTokenFetcher } from './optimism/lyra-avalon.pool.token-fetcher';
import { OptimismLyraAvalonStakingContractPositionFetcher } from './optimism/lyra-avalon.staking.contract-position-fetcher';

@Register.AppModule({
  appId: LYRA_AVALON_DEFINITION.id,
  imports: [SynthetixAppModule],
  providers: [
    LyraAvalonAppDefinition,
    LyraAvalonContractFactory,
    OptimismLyraAvalonBalanceFetcher,
    OptimismLyraAvalonOptionsContractPositionFetcher,
    OptimismLyraAvalonPoolTokenFetcher,
    OptimismLyraAvalonStakingContractPositionFetcher,
  ],
})
export class LyraAvalonAppModule extends AbstractApp() {}
