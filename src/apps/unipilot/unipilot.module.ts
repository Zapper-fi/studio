import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { UnipilotVaultDefinitionsResolver } from './common/unipilot.vault-definition-resolver';
import { UnipilotContractFactory } from './contracts';
import { EthereumUnipilotPoolTokenFetcher } from './ethereum/unipilot.pool.token-fetcher';
import { PolygonUnipilotPoolTokenFetcher } from './polygon/unipilot.pool.token-fetcher';

@Module({
  providers: [
    UnipilotContractFactory,
    UnipilotVaultDefinitionsResolver,
    // Ethereum
    EthereumUnipilotPoolTokenFetcher,
    // Polygon
    PolygonUnipilotPoolTokenFetcher,
  ],
})
export class UnipilotAppModule extends AbstractApp() {}
