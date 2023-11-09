import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalanchePoolTogetherV4TicketTokenFetcher } from './avalanche/pool-together-v4.ticket.token-fetcher';
import { PoolTogetherV4ApiPrizePoolRegistry } from './common/pool-together-v4.api.prize-pool-registry';
import { PoolTogetherV4ViemContractFactory } from './contracts';
import { EthereumPoolTogetherV4TicketTokenFetcher } from './ethereum/pool-together-v4.ticket.token-fetcher';
import { OptimismPoolTogetherV4TicketTokenFetcher } from './optimism/pool-together-v4.ticket.token-fetcher';
import { PolygonPoolTogetherV4TicketTokenFetcher } from './polygon/pool-together-v4.ticket.token-fetcher';

@Module({
  providers: [
    PoolTogetherV4ViemContractFactory,
    PoolTogetherV4ApiPrizePoolRegistry,
    AvalanchePoolTogetherV4TicketTokenFetcher,
    EthereumPoolTogetherV4TicketTokenFetcher,
    OptimismPoolTogetherV4TicketTokenFetcher,
    PolygonPoolTogetherV4TicketTokenFetcher,
  ],
})
export class PoolTogetherV4AppModule extends AbstractApp() {}
