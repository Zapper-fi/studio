import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { AvalancheTraderJoeBalanceFetcher } from './avalanche/trader-joe.balance-fetcher';
import { AvalancheTraderJoeChefBoostedFarmContractPositionFetcher } from './avalanche/trader-joe.chef-boosted-farm.contract-position-fetcher';
import { AvalancheTraderJoeChefV2FarmContractPositionFetcher } from './avalanche/trader-joe.chef-v2-farm.contract-position-fetcher';
import { AvalancheTraderJoeChefV3FarmContractPositionFetcher } from './avalanche/trader-joe.chef-v3-farm.contract-position-fetcher';
import { AvalancheTraderJoePoolTokenFetcher } from './avalanche/trader-joe.pool.token-fetcher';
import { AvalancheTraderJoeSJoeContractPositionFetcher } from './avalanche/trader-joe.s-joe.contract-position-fetcher';
import { AvalancheTraderJoeTvlFetcher } from './avalanche/trader-joe.tvl-fetcher';
import { AvalancheTraderJoeVeJoeFarmContractPositionFetcher } from './avalanche/trader-joe.ve-joe-farm.contract-position-fetcher';
import { AvalancheTraderJoeXJoeTokenFetcher } from './avalanche/trader-joe.x-joe.token-fetcher';
import { TraderJoeContractFactory } from './contracts';
import { TraderJoeAppDefinition, TRADER_JOE_DEFINITION } from './trader-joe.definition';

@Register.AppModule({
  appId: TRADER_JOE_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    TraderJoeAppDefinition,
    TraderJoeContractFactory,
    AvalancheTraderJoeTvlFetcher,
    AvalancheTraderJoeBalanceFetcher,
    AvalancheTraderJoeChefV2FarmContractPositionFetcher,
    AvalancheTraderJoeChefV3FarmContractPositionFetcher,
    AvalancheTraderJoeChefBoostedFarmContractPositionFetcher,
    AvalancheTraderJoePoolTokenFetcher,
    AvalancheTraderJoeXJoeTokenFetcher,
    AvalancheTraderJoeSJoeContractPositionFetcher,
    AvalancheTraderJoeVeJoeFarmContractPositionFetcher,
  ],
})
export class TraderJoeAppModule extends AbstractApp() {}
