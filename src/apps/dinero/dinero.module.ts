import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { DineroViemContractFactory } from './contracts';
import { EthereumDineroApxethTokenFetcher } from './ethereum/dinero.apxeth.token-fetcher';
import { EthereumDineroPirexEthTokenFetcher } from './ethereum/dinero.pxeth.token-fetcher';

@Module({
  providers: [DineroViemContractFactory, EthereumDineroPirexEthTokenFetcher, EthereumDineroApxethTokenFetcher],
})
export class DineroAppModule extends AbstractApp() { }
