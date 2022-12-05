import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { VotiumContractFactory } from './contracts';
import { EthereumVotiumClaimableContractPositionFetcher } from './ethereum/votium.claimable.contract-position-fetcher';
import { EthereumVotiumMerkleCache } from './ethereum/votium.merkle-cache';
import { VotiumAppDefinition, VOTIUM_DEFINITION } from './votium.definition';

@Register.AppModule({
  appId: VOTIUM_DEFINITION.id,
  providers: [
    EthereumVotiumClaimableContractPositionFetcher,
    EthereumVotiumMerkleCache,
    VotiumAppDefinition,
    VotiumContractFactory,
  ],
})
export class VotiumAppModule extends AbstractApp() {}
