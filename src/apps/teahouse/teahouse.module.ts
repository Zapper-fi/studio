import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumTeahouseVaultsTokenFetcher } from './arbitrum/teahouse.vaults.token-fetcher';
import { TeahouseContractFactory } from './contracts';
import { EthereumTeahouseVaultsTokenFetcher } from './ethereum/teahouse.vaults.token-fetcher';
import { OptimismTeahouseVaultsTokenFetcher } from './optimism/teahouse.vaults.token-fetcher';

@Module({
  providers: [
    TeahouseContractFactory,
    ArbitrumTeahouseVaultsTokenFetcher,
    EthereumTeahouseVaultsTokenFetcher,
    OptimismTeahouseVaultsTokenFetcher,
  ],
})
export class TeahouseAppModule extends AbstractApp() {}
