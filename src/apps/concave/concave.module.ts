import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ConcaveAppDefinition } from './concave.definition';
import { ConcaveContractFactory } from './contracts';
import { EthereumConcaveLiquidStakingContractPositionFetcher } from './ethereum/concave.liquid-staking.contract-position-fetcher';

@Module({
  providers: [
    ConcaveContractFactory,
    // Ethereum
    EthereumConcaveLiquidStakingContractPositionFetcher,
  ],
})
export class ConcaveAppModule extends AbstractApp() {}
