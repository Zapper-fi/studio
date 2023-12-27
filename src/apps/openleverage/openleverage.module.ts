import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainOpenleveragePoolTokenFetcher } from './binance-smart-chain/openleverage.pool.token-fetcher';
import { OpenleverageViemContractFactory } from './contracts';
import { EthereumOpenleveragePoolTokenFetcher } from './ethereum/openleverage.pool.token-fetcher';

@Module({
  providers: [
    OpenleverageViemContractFactory,
    EthereumOpenleveragePoolTokenFetcher,
    BinanceSmartChainOpenleveragePoolTokenFetcher,
  ],
})
export class OpenleverageAppModule extends AbstractApp() {}
