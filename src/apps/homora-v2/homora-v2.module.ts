import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheHomoraV2FarmContractPositionFetcher } from './avalanche/homora-v2.farm.contract-position-fetcher';
import { HomoraV2ViemContractFactory } from './contracts';
import { EthereumHomoraV2FarmContractPositionFetcher } from './ethereum/homora-v2.farm.contract-position-fetcher';
import { FantomHomoraV2FarmContractPositionFetcher } from './fantom/homora-v2.farm.contract-position-fetcher';
import { OptimismHomoraV2FarmContractPositionFetcher } from './optimism/homora-v2.farm.contract-position-fetcher';

@Module({
  providers: [
    HomoraV2ViemContractFactory,
    // Ethereum
    EthereumHomoraV2FarmContractPositionFetcher,
    // Avalanche
    AvalancheHomoraV2FarmContractPositionFetcher,
    // Fantom
    FantomHomoraV2FarmContractPositionFetcher,
    // Optimism
    OptimismHomoraV2FarmContractPositionFetcher,
  ],
})
export class HomoraV2AppModule extends AbstractApp() {}
