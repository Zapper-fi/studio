import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumBananoFarmContractPositionFetcher } from './arbitrum/banano.farm.contract-position-fetcher';
import { BinanceSmartChainBananoFarmContractPositionFetcher } from './binance-smart-chain/banano.farm.contract-position-fetcher';
import { BananoViemContractFactory } from './contracts';
import { EthereumBananoFarmContractPositionFetcher } from './ethereum/banano.farm.contract-position-fetcher';
import { FantomBananoFarmContractPositionFetcher } from './fantom/banano.farm.contract-position-fetcher';
import { PolygonBananoFarmContractPositionFetcher } from './polygon/banano.farm.contract-position-fetcher';

@Module({
  providers: [
    BananoViemContractFactory,
    BinanceSmartChainBananoFarmContractPositionFetcher,
    PolygonBananoFarmContractPositionFetcher,
    FantomBananoFarmContractPositionFetcher,
    EthereumBananoFarmContractPositionFetcher,
    ArbitrumBananoFarmContractPositionFetcher,
  ],
})
export class BananoAppModule extends AbstractApp() {}
