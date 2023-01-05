import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { UnipilotVaultDefinitionsResolver } from './common/unipilot.vault-definition-resolver';
import { UnipilotContractFactory } from './contracts';
import { EthereumUnipilotPoolTokenFetcher } from './ethereum/unipilot.pool.token-fetcher';
import { UnipilotVaultAPYHelper } from './common/unipilot-vault.apy.helper';
import { PolygonUnipilotPoolTokenFetcher } from './polygon/unipilot.pool.token-fetcher';
import { UnipilotAppDefinition } from './unipilot.definition';

@Module({
  providers: [
    UnipilotAppDefinition,
    UnipilotContractFactory,
    UnipilotVaultDefinitionsResolver,
    UnipilotVaultAPYHelper,
    // Ethereum
    EthereumUnipilotPoolTokenFetcher,
    // Polygon
    PolygonUnipilotPoolTokenFetcher,
  ],
})
export class UnipilotAppModule extends AbstractApp() {}
