import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalanchePoolTogetherV4TicketTokenFetcher } from './avalanche/pool-together-v4.ticket.token-fetcher';
import { PoolTogetherV4ApiPrizePoolRegistry } from './common/pool-together-v4.api.prize-pool-registry';
import { PoolTogetherV4ContractFactory } from './contracts';
import { EthereumPoolTogetherV4TicketTokenFetcher } from './ethereum/pool-together-v4.ticket.token-fetcher';
import { OptimismPoolTogetherV4TicketTokenFetcher } from './optimism/pool-together-v4.ticket.token-fetcher';
import { PolygonPoolTogetherV4TicketTokenFetcher } from './polygon/pool-together-v4.ticket.token-fetcher';
import { PoolTogetherV4AppDefinition } from './pool-together-v4.definition';

@Module({
  providers: [
    AvalanchePoolTogetherV4TicketTokenFetcher,
    EthereumPoolTogetherV4TicketTokenFetcher,
    OptimismPoolTogetherV4TicketTokenFetcher,
    PolygonPoolTogetherV4TicketTokenFetcher,
    PoolTogetherV4ApiPrizePoolRegistry,

    PoolTogetherV4ContractFactory,
  ],
})
export class PoolTogetherV4AppModule extends AbstractApp() {}
