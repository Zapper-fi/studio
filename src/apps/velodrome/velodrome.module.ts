import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { VelodromeContractFactory } from './contracts';
import { OptimismVelodromeStakingContractPositionFetcher } from './optimism/velodrome.farm.contract-position-fetcher';
import { OptimismVelodromePoolsTokenFetcher } from './optimism/velodrome.pool.token-fetcher';
import { OptimismVelodromeVotingEscrowContractPositionFetcher } from './optimism/velodrome.voting-escrow.contract-position-fetcher';
import { VelodromeAppDefinition, VELODROME_DEFINITION } from './velodrome.definition';

@Register.AppModule({
  appId: VELODROME_DEFINITION.id,
  providers: [
    OptimismVelodromePoolsTokenFetcher,
    OptimismVelodromeStakingContractPositionFetcher,
    OptimismVelodromeVotingEscrowContractPositionFetcher,
    VelodromeAppDefinition,
    VelodromeContractFactory,
  ],
})
export class VelodromeAppModule extends AbstractApp() {}
