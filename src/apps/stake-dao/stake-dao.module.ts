import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { StakeDaoViemContractFactory } from './contracts';
import { EthereumStakeDaoFarmContractPositionFetcher } from './ethereum/stake-dao.farm.contract-position-fetcher';
import { EthereumStakeDaoGaugeContractPositionFetcher } from './ethereum/stake-dao.gauge.contract-position-fetcher';
import { EthereumStakeDaoLockerTokenFetcher } from './ethereum/stake-dao.locker.token-fetcher';
import { EthereumStakeDaoMultiGaugeContractPositionFetcher } from './ethereum/stake-dao.multi-gauge.contract-position-fetcher';
import { EthereumStakeDaoVaultTokenFetcher } from './ethereum/stake-dao.vault.token-fetcher';
import { EthereumStakeDaoEscrowedQiContractPositionFetcher } from './ethereum/stake-dao.voting-escrow.contract-position-fetcher';

@Module({
  providers: [
    StakeDaoViemContractFactory,
    EthereumStakeDaoLockerTokenFetcher,
    EthereumStakeDaoGaugeContractPositionFetcher,
    EthereumStakeDaoFarmContractPositionFetcher,
    EthereumStakeDaoEscrowedQiContractPositionFetcher,
    EthereumStakeDaoVaultTokenFetcher,
    EthereumStakeDaoMultiGaugeContractPositionFetcher,
  ],
})
export class StakeDaoAppModule extends AbstractApp() {}
