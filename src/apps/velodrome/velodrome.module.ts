import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CurvePoolTokenHelper } from '~apps/curve';

import { VelodromeContractFactory } from './contracts';
import { OptimismVelodromePoolsTokenFetcher } from './optimism/velodrome.pool.token-fetcher';
import { OptimismVelodromeStakingContractPositionFetcher } from './optimism/velodrome.staking.contract-position-fetcher';
import { OptimismVelodromeVotingEscrowContractPositionFetcher } from './optimism/velodrome.voting-escrow.contract-position-fetcher';
import { VelodromeAppDefinition, VELODROME_DEFINITION } from './velodrome.definition';

@Register.AppModule({
  appId: VELODROME_DEFINITION.id,
  providers: [
    CurvePoolTokenHelper,
    OptimismVelodromePoolsTokenFetcher,
    OptimismVelodromeStakingContractPositionFetcher,
    OptimismVelodromeVotingEscrowContractPositionFetcher,
    VelodromeAppDefinition,
    VelodromeContractFactory,
  ],
})
export class VelodromeAppModule extends AbstractApp() {}
