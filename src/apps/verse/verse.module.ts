import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ViemContractFactory } from '~apps/uniswap-v2/contracts';

import { VerseViemContractFactory } from './contracts';
import { EthereumVerseFarmContractPositionFetcher } from './ethereum/verse.farm.contract-position-fetcher';
import { EthereumVersePoolTokenFetcher } from './ethereum/verse.pool.token-fetcher';

@Module({
  providers: [
    EthereumVerseFarmContractPositionFetcher,
    EthereumVersePoolTokenFetcher,
    UniswapV2ViemContractFactory,
    VerseViemContractFactory,
  ],
})
export class VerseAppModule extends AbstractApp() {}
