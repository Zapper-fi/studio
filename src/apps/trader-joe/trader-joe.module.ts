import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ViemContractFactory } from '~apps/uniswap-v2/contracts';

import { AvalancheTraderJoeChefBoostedFarmContractPositionFetcher } from './avalanche/trader-joe.chef-boosted-farm.contract-position-fetcher';
import { AvalancheTraderJoeChefV2FarmContractPositionFetcher } from './avalanche/trader-joe.chef-v2-farm.contract-position-fetcher';
import { AvalancheTraderJoeChefV3FarmContractPositionFetcher } from './avalanche/trader-joe.chef-v3-farm.contract-position-fetcher';
import { AvalancheTraderJoePoolTokenFetcher } from './avalanche/trader-joe.pool.token-fetcher';
import { AvalancheTraderJoeSJoeContractPositionFetcher } from './avalanche/trader-joe.s-joe.contract-position-fetcher';
import { AvalancheTraderJoeVeJoeContractPositionFetcher } from './avalanche/trader-joe.ve-joe-farm.contract-position-fetcher';
import { AvalancheTraderJoeXJoeTokenFetcher } from './avalanche/trader-joe.x-joe.token-fetcher';
import { TraderJoeViemContractFactory } from './contracts';

@Module({
  providers: [
    TraderJoeViemContractFactory,
    UniswapV2ViemContractFactory,
    AvalancheTraderJoeChefV2FarmContractPositionFetcher,
    AvalancheTraderJoeChefV3FarmContractPositionFetcher,
    AvalancheTraderJoeChefBoostedFarmContractPositionFetcher,
    AvalancheTraderJoePoolTokenFetcher,
    AvalancheTraderJoeXJoeTokenFetcher,
    AvalancheTraderJoeSJoeContractPositionFetcher,
    AvalancheTraderJoeVeJoeContractPositionFetcher,
  ],
})
export class TraderJoeAppModule extends AbstractApp() {}
