import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';
import { SynthetixAppModule } from '~apps/synthetix/synthetix.module';

import { AelinAppDefinition } from './aelin.definition';
import { AelinContractFactory } from './contracts';
import { EthereumAelinBalanceFetcher } from './ethereum/aelin.balance-fetcher';
import { EthereumAelinPoolTokenFetcher } from './ethereum/aelin.pool.token-fetcher';
import { OptimismAelinBalanceFetcher } from './optimism/aelin.balance-fetcher';
import { OptimismAelinFarmContractPositionFetcher } from './optimism/aelin.farm.contract-position-fetcher';
import { OptimismAelinPoolTokenFetcher } from './optimism/aelin.pool.token-fetcher';
import { OptimismAelinVAelinTokenFetcher } from './optimism/aelin.v-aelin.token-fetcher';

@Module({
  imports: [SynthetixAppModule.externallyConfigured(SynthetixAppModule, 0)],
  providers: [
    AelinAppDefinition,
    AelinContractFactory,
    // Ethereum
    EthereumAelinBalanceFetcher,
    EthereumAelinPoolTokenFetcher,
    // Optimism
    OptimismAelinPoolTokenFetcher,
    OptimismAelinVAelinTokenFetcher,
    OptimismAelinBalanceFetcher,
    OptimismAelinFarmContractPositionFetcher,
  ],
})
export class AelinAppModule extends AbstractDynamicApp<AelinAppModule>() {}
