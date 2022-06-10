import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { VotiumContractFactory } from './contracts';
import { EthereumVotiumClaimableContractPositionBalanceFetcher } from './ethereum/votium.claimable.contract-position-balance-fetcher';
import { EthereumVotiumClaimableContractPositionFetcher } from './ethereum/votium.claimable.contract-position-fetcher';
import { EthereumVotiumMerkleCache } from './ethereum/votium.merkle-cache';
import { VotiumAppDefinition, VOTIUM_DEFINITION } from './votium.definition';

@Register.AppModule({
  appId: VOTIUM_DEFINITION.id,
  providers: [
    EthereumVotiumClaimableContractPositionFetcher,
    EthereumVotiumClaimableContractPositionBalanceFetcher,
    EthereumVotiumMerkleCache,
    VotiumAppDefinition,
    VotiumContractFactory,
  ],
})
export class VotiumAppModule extends AbstractApp() {}
