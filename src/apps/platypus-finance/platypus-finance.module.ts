import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

//import { AvalanchePlatypusFinanceChefContractPositionFetcher } from './avalanche/platypus-finance.chef.contract-position-fetcher';
//import { AvalanchePlatypusFinanceFarmContractPositionFetcher } from './avalanche/platypus-finance.farm.contract-position-fetcher';
//import { AvalanchePlatypusFinancePoolTokenFetcher } from './avalanche/platypus-finance.pool.token-fetcher';
import { AvalanchePlatypusFinanceVotingEscrowContractPositionFetcher } from './avalanche/platypus-finance.voting-escrow.contract-position-fetcher';
import { PlatypusFinanceViemContractFactory } from './contracts';

@Module({
  providers: [
    PlatypusFinanceViemContractFactory,
    // Avalanche
    //AvalanchePlatypusFinancePoolTokenFetcher,
    //AvalanchePlatypusFinanceFarmContractPositionFetcher,
    //AvalanchePlatypusFinanceChefContractPositionFetcher,
    AvalanchePlatypusFinanceVotingEscrowContractPositionFetcher,
  ],
})
export class PlatypusFinanceAppModule extends AbstractApp() {}
