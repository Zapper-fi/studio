import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { PolygonStakingViemContractFactory } from './contracts';
import { EthereumPolygonStakingContractPositionFetcher } from './ethereum/polygon-staking.deposit.contract-position-fetcher';

@Module({
  providers: [PolygonStakingViemContractFactory, EthereumPolygonStakingContractPositionFetcher],
})
export class PolygonStakingAppModule extends AbstractApp() {}
