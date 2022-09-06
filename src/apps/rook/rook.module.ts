import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { RookContractFactory } from './contracts';
import { EthereumRookV2PoolTokenFetcher } from './ethereum/rook.pool-v2.token-fetcher';
import { EthereumRookV3PoolTokenFetcher } from './ethereum/rook.pool-v3.token-fetcher';
import { EthereumRookXRookTokenFetcher } from './ethereum/rook.x-rook.token-fetcher';
import { RookAppDefinition, ROOK_DEFINITION } from './rook.definition';

@Register.AppModule({
  appId: ROOK_DEFINITION.id,
  providers: [
    RookAppDefinition,
    RookContractFactory,
    EthereumRookV2PoolTokenFetcher,
    EthereumRookV3PoolTokenFetcher,
    EthereumRookXRookTokenFetcher,
  ],
})
export class RookAppModule extends AbstractApp() {}
