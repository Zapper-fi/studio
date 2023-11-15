import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ConcaveViemContractFactory } from './contracts';
import { EthereumConcaveLiquidStakingContractPositionFetcher } from './ethereum/concave.liquid-staking.contract-position-fetcher';

@Module({
  providers: [
    ConcaveViemContractFactory,
    // Ethereum
    EthereumConcaveLiquidStakingContractPositionFetcher,
  ],
})
export class ConcaveAppModule extends AbstractApp() {}
