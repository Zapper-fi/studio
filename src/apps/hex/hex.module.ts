import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { HexContractFactory } from './contracts';
import { EthereumHexStakeContractPositionFetcher } from './ethereum/hex.stake.contract-position-fetcher';

@Module({
  providers: [HexContractFactory, EthereumHexStakeContractPositionFetcher],
})
export class HexAppModule extends AbstractApp() {}
