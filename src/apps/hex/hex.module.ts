import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { HexViemContractFactory } from './contracts';
import { EthereumHexStakeContractPositionFetcher } from './ethereum/hex.stake.contract-position-fetcher';

@Module({
  providers: [HexViemContractFactory, EthereumHexStakeContractPositionFetcher],
})
export class HexAppModule extends AbstractApp() {}
