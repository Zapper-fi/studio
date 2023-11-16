import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { EthereumStakingViemContractFactory } from './contracts';
import { EthereumEthereumStakingDepositContractPositionFetcher } from './ethereum/ethereum-staking.deposit.contract-position-fetcher';

@Module({
  providers: [EthereumStakingViemContractFactory, EthereumEthereumStakingDepositContractPositionFetcher],
})
export class EthereumStakingAppModule extends AbstractApp() {}
