import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { MstableViemContractFactory } from './contracts';
import { EthereumMstableEarnContractPositionFetcher } from './ethereum/mstable.earn.contract-position-fetcher';
import { EthereumMstableMtaV1FarmContractPositionFetcher } from './ethereum/mstable.mta-v1-farm.contract-position-fetcher';
import { EthereumMstableMtaV2FarmContractPositionFetcher } from './ethereum/mstable.mta-v2-farm.contract-position-fetcher';
import { EthereumMstableSavingsVaultContractPositionFetcher } from './ethereum/mstable.savings-vault.contract-position-fetcher';
import { PolygonMstableSavingsVaultContractPositionFetcher } from './polygon/mstable.savings-vault-farm.contract-position-fetcher';

@Module({
  providers: [
    MstableViemContractFactory,
    EthereumMstableEarnContractPositionFetcher,
    EthereumMstableMtaV1FarmContractPositionFetcher,
    EthereumMstableMtaV2FarmContractPositionFetcher,
    EthereumMstableSavingsVaultContractPositionFetcher,
    PolygonMstableSavingsVaultContractPositionFetcher,
  ],
})
export class MStableAppModule extends AbstractApp() {}
