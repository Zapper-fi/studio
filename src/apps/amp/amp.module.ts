import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AmpStakingResolver } from './common/amp.staking-resolver';
import { AmpContractFactory } from './contracts';
import { EthereumAmpFarmContractPositionFetcher } from './ethereum/amp.farm.contract-position-fetcher';

@Module({
  providers: [AmpContractFactory, AmpStakingResolver, EthereumAmpFarmContractPositionFetcher],
})
export class AmpAppModule extends AbstractApp() {}
