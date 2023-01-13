import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { RocketPoolContractFactory } from './contracts';
import { EthereumRocketPoolMinipoolContractPositionFetcher } from './ethereum/rocket-pool.minipool.contract-position-fetcher';
import { EthereumRocketPoolOracleDaoBondContractPositionFetcher } from './ethereum/rocket-pool.oracle-dao-bond.contract-position-fetcher';
import { EthereumRocketPoolStakingContractPositionFetcher } from './ethereum/rocket-pool.staking.contract-position-fetcher';
import { RocketPoolAppDefinition } from './rocket-pool.definition';

@Module({
  providers: [
    RocketPoolContractFactory,
    // Ethereum
    EthereumRocketPoolOracleDaoBondContractPositionFetcher,
    EthereumRocketPoolStakingContractPositionFetcher,
    EthereumRocketPoolMinipoolContractPositionFetcher,
  ],
})
export class RocketPoolAppModule extends AbstractApp() {}
