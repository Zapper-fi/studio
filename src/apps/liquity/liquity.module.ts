import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { LiquityContractFactory } from './contracts';
import { EthereumLiquityStabilityPoolContractPositionFetcher } from './ethereum/liquity.stability-pool.contract-position-fetcher';
import { EthereumLiquityStakingContractPositionFetcher } from './ethereum/liquity.staking.contract-position-fetcher';
import { EthereumLiquityTroveContractPositionFetcher } from './ethereum/liquity.trove.contract-position-fetcher';

@Module({
  providers: [
    LiquityContractFactory,
    EthereumLiquityStabilityPoolContractPositionFetcher,
    EthereumLiquityStakingContractPositionFetcher,
    EthereumLiquityTroveContractPositionFetcher,
  ],
})
export class LiquityAppModule extends AbstractApp() {}
