import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { RookContractFactory } from './contracts';
import { EthereumRookClaimableContractPositionFetcher } from './ethereum/rook.claimable.contract-position-fetcher';
import { EthereumRookV2PoolTokenFetcher } from './ethereum/rook.v2-pool.token-fetcher';
import { EthereumRookV3PoolTokenFetcher } from './ethereum/rook.v3-pool.token-fetcher';
import { EthereumRookXRookTokenFetcher } from './ethereum/rook.x-rook.token-fetcher';
import { RookAppDefinition, ROOK_DEFINITION } from './rook.definition';

@Register.AppModule({
  appId: ROOK_DEFINITION.id,
  providers: [
    RookAppDefinition,
    RookContractFactory,
    // Ethereum
    EthereumRookV2PoolTokenFetcher,
    EthereumRookV3PoolTokenFetcher,
    EthereumRookXRookTokenFetcher,
    EthereumRookClaimableContractPositionFetcher,
  ],
})
export class RookAppModule extends AbstractApp() {}
