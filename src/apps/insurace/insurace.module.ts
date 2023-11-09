import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheInsuraceMiningTokenFetcher } from './avalanche/insurace.mining.token-fetcher';
import { BinanceSmartChainInsuraceMiningTokenFetcher } from './binance-smart-chain/insurace.mining.token-fetcher';
import { InsuraceViemContractFactory } from './contracts';
import { EthereumInsuraceMiningTokenFetcher } from './ethereum/insurace.mining.token-fetcher';
import { PolygonInsuraceMiningTokenFetcher } from './polygon/insurace.mining.token-fetcher';

@Module({
  providers: [
    InsuraceViemContractFactory,
    // Avalanche
    AvalancheInsuraceMiningTokenFetcher,
    // Binance-smart-chain
    BinanceSmartChainInsuraceMiningTokenFetcher,
    // Ethereum
    EthereumInsuraceMiningTokenFetcher,
    // Polygon
    PolygonInsuraceMiningTokenFetcher,
  ],
})
export class InsuraceAppModule extends AbstractApp() {}
