import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { TokemakClaimableResolver } from './common/tokemak.claimable.resolver';
import { TokemakViemContractFactory } from './contracts';
import { EthereumTokemakClaimableContractPositionFetcher } from './ethereum/tokemak.claimable.contract-position-fetcher';
import { EthereumTokemakFarmContractPositionFetcher } from './ethereum/tokemak.farm.contract-position-fetcher';

@Module({
  providers: [
    TokemakViemContractFactory,
    TokemakClaimableResolver,
    EthereumTokemakFarmContractPositionFetcher,
    EthereumTokemakClaimableContractPositionFetcher,
  ],
})
export class TokemakAppModule extends AbstractApp() {}
