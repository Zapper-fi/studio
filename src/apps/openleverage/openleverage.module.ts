import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainOpenleveragePoolTokenFetcher } from './binance-smart-chain/openleverage.pool.token-fetcher';
import { OpenleveragePoolAPYHelper } from './common/openleverage-pool.apy-helper';
import { OpenleverageViemContractFactory } from './contracts';
import { EthereumOpenleveragePoolTokenFetcher } from './ethereum/openleverage.pool.token-fetcher';

@Module({
  providers: [
    EthereumOpenleveragePoolTokenFetcher,
    BinanceSmartChainOpenleveragePoolTokenFetcher,

    OpenleverageViemContractFactory,
    OpenleveragePoolAPYHelper,
  ],
})
export class OpenleverageAppModule extends AbstractApp() {}
