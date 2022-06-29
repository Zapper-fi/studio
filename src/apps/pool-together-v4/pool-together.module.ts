import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalanchePoolTogetherBalanceFetcher } from './avalanche/pool-together.balance-fetcher';
import { AvalanchePoolTogetherV4TicketTokenFetcher } from './avalanche/pool-together.v4-ticket.token-fetcher';
import { PoolTogetherContractFactory } from './contracts';
import { EthereumPoolTogetherBalanceFetcher } from './ethereum/pool-together.balance-fetcher';
import { EthereumPoolTogetherV4TicketTokenFetcher } from './ethereum/pool-together.v4-ticket.token-fetcher';
import { PoolTogetherClaimableTokenBalancesHelper } from './helpers/pool-together-v3.claimable.balance-helper';
import { PoolTogetherV4PrizePoolTokenHelper } from './helpers/pool-together-v4.prize-pool.token-helper';
import { PoolTogetherAirdropTokenBalancesHelper } from './helpers/pool-together.airdrop.balance-helper';
import { PoolTogetherApiPrizePoolRegistry } from './helpers/pool-together.api.prize-pool-registry';
import { PolygonPoolTogetherBalanceFetcher } from './polygon/pool-together.balance-fetcher';
import { PolygonPoolTogetherV4TicketTokenFetcher } from './polygon/pool-together.v4-ticket.token-fetcher';
import POOL_TOGETHER_DEFINITION, { PoolTogetherAppDefinition } from './pool-together.definition';

@Register.AppModule({
  appId: POOL_TOGETHER_DEFINITION.id,
  providers: [
    PoolTogetherAppDefinition,
    PoolTogetherContractFactory,
    PoolTogetherApiPrizePoolRegistry,
    // Helpers
    PoolTogetherAirdropTokenBalancesHelper,
    PoolTogetherClaimableTokenBalancesHelper,
    PoolTogetherV4PrizePoolTokenHelper,
    // Avalanche
    AvalanchePoolTogetherBalanceFetcher,
    AvalanchePoolTogetherV4TicketTokenFetcher,
    // Ethereum
    EthereumPoolTogetherBalanceFetcher,
    EthereumPoolTogetherV4TicketTokenFetcher,
    // Polygon
    PolygonPoolTogetherBalanceFetcher,
    PolygonPoolTogetherV4TicketTokenFetcher,
  ],
})
export class PoolTogetherAppModule extends AbstractApp() {}
