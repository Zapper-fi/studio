import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CurveAppModule } from '~apps/curve';

import { VelodromeContractFactory } from './contracts';
import { OptimismVelodromeBalanceFetcher } from './optimism/velodrome.balance-fetcher';
import { OptimismVelodromePoolsTokenFetcher } from './optimism/velodrome.pools.token-fetcher';
import { OptimismVelodromeStakingContractPositionFetcher } from './optimism/velodrome.staking.contract-position-fetcher';
import { OptimismVelodromeVotingEscrowContractPositionFetcher } from './optimism/velodrome.voting-escrow.contract-position-fetcher';
import { VelodromeAppDefinition, VELODROME_DEFINITION } from './velodrome.definition';

@Register.AppModule({
  appId: VELODROME_DEFINITION.id,
  imports: [CurveAppModule],
  providers: [
    OptimismVelodromeBalanceFetcher,
    OptimismVelodromePoolsTokenFetcher,
    OptimismVelodromeStakingContractPositionFetcher,
    OptimismVelodromeVotingEscrowContractPositionFetcher,
    VelodromeAppDefinition,
    VelodromeContractFactory,
  ],
})
export class VelodromeAppModule extends AbstractApp() {}
