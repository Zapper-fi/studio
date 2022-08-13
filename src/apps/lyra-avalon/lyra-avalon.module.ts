import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { SynthetixAppModule } from '~apps/synthetix';

import { LyraAvalonContractFactory } from './contracts';
import { LyraAvalonAppDefinition, LYRA_AVALON_DEFINITION } from './lyra-avalon.definition';
import { AaveSafetyModuleClaimableBalanceHelper } from './optimism/helpers/aave-safety.claimable.balance-helper';
import { OptimismLyraAvalonBalanceFetcher } from './optimism/lyra-avalon.balance-fetcher';
import { OptimismLyraAvalonOptionsContractPositionFetcher } from './optimism/lyra-avalon.options.contract-position-fetcher';
import { OptimismLyraAvalonPoolTokenFetcher } from './optimism/lyra-avalon.pool.token-fetcher';
import { OptimismLyraAvalonStakingContractPositionFetcher } from './optimism/lyra-avalon.staking.contract-position-fetcher';
import { OptimismLyraAvalonStakingTokenFetcher } from './optimism/lyra-avalon.ve.token-fetcher';

@Register.AppModule({
  appId: LYRA_AVALON_DEFINITION.id,
  imports: [SynthetixAppModule],
  providers: [
    AaveSafetyModuleClaimableBalanceHelper,
    LyraAvalonAppDefinition,
    LyraAvalonContractFactory,
    OptimismLyraAvalonBalanceFetcher,
    OptimismLyraAvalonOptionsContractPositionFetcher,
    OptimismLyraAvalonPoolTokenFetcher,
    OptimismLyraAvalonStakingContractPositionFetcher,
    OptimismLyraAvalonStakingTokenFetcher,
  ],
})
export class LyraAvalonAppModule extends AbstractApp() {}
