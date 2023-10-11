import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { MetaStreetContractFactory } from './contracts';
import { EthereumMetaStreetLendingV2LegacyContractPositionFetcher } from './ethereum/meta-street.lending-v2-legacy.contract-position-fetcher';
import { EthereumMetaStreetLendingV2ContractPositionFetcher } from './ethereum/meta-street.lending-v2.contract-position-fetcher';

@Module({
  providers: [
    EthereumMetaStreetLendingV2ContractPositionFetcher,
    EthereumMetaStreetLendingV2LegacyContractPositionFetcher,
    MetaStreetContractFactory,
  ],
})
export class MetaStreetAppModule extends AbstractApp() {}
