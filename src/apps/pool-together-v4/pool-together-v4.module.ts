import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalanchePoolTogetherV4BalanceFetcher } from './avalanche/pool-together-v4.balance-fetcher';
import { AvalanchePoolTogetherV4TicketTokenFetcher } from './avalanche/pool-together-v4.ticket-token-fetcher';
import { PoolTogetherContractFactory } from './contracts';
import { EthereumPoolTogetherV4BalanceFetcher } from './ethereum/pool-together-v4.balance-fetcher';
import { EthereumPoolTogetherV4TicketTokenFetcher } from './ethereum/pool-together-v4.ticket-token-fetcher';
import { PoolTogetherV4AirdropTokenBalancesHelper } from './helpers/pool-together-v4.airdrop.balance-helper';
import { PoolTogetherV4ApiPrizePoolRegistry } from './helpers/pool-together-v4.api.prize-pool-registry';
import { PoolTogetherV4ClaimableTokenBalancesHelper } from './helpers/pool-together-v4.claimable.balance-helper';
import { PoolTogetherV4PrizePoolTokenHelper } from './helpers/pool-together-v4.prize-pool.token-helper';
import { OptimismPoolTogetherV4BalanceFetcher } from './optimism/pool-together-v4.balance-fetcher';
import { OptimismPoolTogetherV4TicketTokenFetcher } from './optimism/pool-together-v4.ticket-token-fetcher';
import { PolygonPoolTogetherV4BalanceFetcher } from './polygon/pool-together-v4.balance-fetcher';
import { PolygonPoolTogetherV4TicketTokenFetcher } from './polygon/pool-together-v4.ticket-token-fetcher';
import POOL_TOGETHER_V4_DEFINITION, { PoolTogetherV4AppDefinition } from './pool-together-v4.definition';

@Register.AppModule({
  appId: POOL_TOGETHER_V4_DEFINITION.id,
  providers: [
    PoolTogetherV4AppDefinition,
    PoolTogetherContractFactory,
    PoolTogetherV4ApiPrizePoolRegistry,
    // Helpers
    PoolTogetherV4AirdropTokenBalancesHelper,
    PoolTogetherV4ClaimableTokenBalancesHelper,
    PoolTogetherV4PrizePoolTokenHelper,
    // Avalanche
    AvalanchePoolTogetherV4BalanceFetcher,
    AvalanchePoolTogetherV4TicketTokenFetcher,
    // Ethereum
    EthereumPoolTogetherV4BalanceFetcher,
    EthereumPoolTogetherV4TicketTokenFetcher,
    // Polygon
    PolygonPoolTogetherV4BalanceFetcher,
    PolygonPoolTogetherV4TicketTokenFetcher,
    // Optimism
    OptimismPoolTogetherV4BalanceFetcher,
    OptimismPoolTogetherV4TicketTokenFetcher,
  ],
})
export class PoolTogetherV4AppModule extends AbstractApp() {}
