import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheSteakHutPoolContractPositionFetcher } from './avalanche/steak-hut.pool.contract-position-fetcher';
import { AvalancheSteakHutStakingContractPositionFetcher } from './avalanche/steak-hut.staking.contract-position-fetcher';
import { SteakHutViemContractFactory } from './contracts';

@Module({
  providers: [
    SteakHutViemContractFactory,
    AvalancheSteakHutPoolContractPositionFetcher,
    AvalancheSteakHutStakingContractPositionFetcher,
  ],
})
export class SteakHutAppModule extends AbstractApp() {}
