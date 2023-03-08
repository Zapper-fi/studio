import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { MstableContractFactory } from './contracts';
import { EthereumMstableEarnContractPositionFetcher } from './ethereum/mstable.earn.contract-position-fetcher';
import { EthereumMstableImusdTokenFetcher } from './ethereum/mstable.imusd.token-fetcher';
import { EthereumMstableMetaVaultTokenFetcher } from './ethereum/mstable.meta-vault.token-fetcher';
import { EthereumMstableMtaV1FarmContractPositionFetcher } from './ethereum/mstable.mta-v1-farm.contract-position-fetcher';
import { EthereumMstableMtaV2FarmContractPositionFetcher } from './ethereum/mstable.mta-v2-farm.contract-position-fetcher';
import { EthereumMstableSavingsVaultContractPositionFetcher } from './ethereum/mstable.savings-vault.contract-position-fetcher';
import { PolygonMstableImusdTokenFetcher } from './polygon/mstable.imusd.token-fetcher';
import { PolygonMstableSavingsVaultContractPositionFetcher } from './polygon/mstable.savings-vault-farm.contract-position-fetcher';

@Module({
  providers: [
    MstableContractFactory,
    EthereumMstableEarnContractPositionFetcher,
    EthereumMstableImusdTokenFetcher,
    EthereumMstableMtaV1FarmContractPositionFetcher,
    EthereumMstableMtaV2FarmContractPositionFetcher,
    EthereumMstableMetaVaultTokenFetcher,
    EthereumMstableSavingsVaultContractPositionFetcher,
    PolygonMstableImusdTokenFetcher,
    PolygonMstableSavingsVaultContractPositionFetcher,
  ],
})
export class MStableAppModule extends AbstractApp() {}
