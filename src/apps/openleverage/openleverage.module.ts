import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainOpenleveragePoolTokenFetcher } from './binance-smart-chain/openleverage.pool.token-fetcher';
import { OpenleveragePoolAPYHelper } from './common/openleverage-pool.apy-helper';
import { OpenleverageContractFactory } from './contracts';
import { EthereumOpenleveragePoolTokenFetcher } from './ethereum/openleverage.pool.token-fetcher';

@Module({
  providers: [
    EthereumOpenleveragePoolTokenFetcher,
    BinanceSmartChainOpenleveragePoolTokenFetcher,

    OpenleverageContractFactory,
    OpenleveragePoolAPYHelper,
  ],
})
export class OpenleverageAppModule extends AbstractApp() {}
