import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ApecoinAppDefinition } from './apecoin.definition';
import { ApecoinContractFactory } from './contracts';
import { EthereumApecoinStakingContractPositionFetcher } from './ethereum/apecoin.staking.contract-position-fetcher';

@Module({
  providers: [ApecoinAppDefinition, ApecoinContractFactory, EthereumApecoinStakingContractPositionFetcher],
})
export class ApecoinAppModule extends AbstractApp() {}
