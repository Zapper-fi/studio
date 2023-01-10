import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BottoAppDefinition } from './botto.definition';
import { BottoContractFactory } from './contracts';
import { EthereumBottoFarmContractPositionFetcher } from './ethereum/botto.farm.contract-position-fetcher';
import { EthereumBottoGovernanceContractPositionFetcher } from './ethereum/botto.governance.contract-position-fetcher';

@Module({
  providers: [
    BottoAppDefinition,
    BottoContractFactory,
    EthereumBottoFarmContractPositionFetcher,
    EthereumBottoGovernanceContractPositionFetcher,
  ],
})
export class BottoAppModule extends AbstractApp() {}
