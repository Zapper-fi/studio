import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { TempusContractFactory } from './contracts';
import { EthereumTempusAmmTokenFetcher } from './ethereum/tempus.amm.token-fetcher';
import { EthereumTempusPoolTokenFetcher } from './ethereum/tempus.pool.token-fetcher';
import { FantomTempusAmmTokenFetcher } from './fantom/tempus.amm.token-fetcher';
import { FantomTempusPoolTokenFetcher } from './fantom/tempus.pool.token-fetcher';
import { TempusAppDefinition } from './tempus.definition';

@Module({
  providers: [
    TempusContractFactory,
    // Ethereum
    EthereumTempusAmmTokenFetcher,
    EthereumTempusPoolTokenFetcher,
    // Fantom
    FantomTempusAmmTokenFetcher,
    FantomTempusPoolTokenFetcher,
  ],
})
export class TempusAppModule extends AbstractApp() {}
