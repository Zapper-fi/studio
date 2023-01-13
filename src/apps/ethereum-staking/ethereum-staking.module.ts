import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { EthereumStakingContractFactory } from './contracts';
import { EthereumStakingAppDefinition } from './ethereum-staking.definition';
import { EthereumEthereumStakingDepositContractPositionFetcher } from './ethereum/ethereum-staking.deposit.contract-position-fetcher';

@Module({
  providers: [EthereumStakingContractFactory, EthereumEthereumStakingDepositContractPositionFetcher],
})
export class EthereumStakingAppModule extends AbstractApp() {}
