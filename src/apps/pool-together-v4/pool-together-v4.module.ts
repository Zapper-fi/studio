import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { PoolTogetherV3AppModule } from '~apps/pool-together-v3';

import { AvalanchePoolTogetherV4ClaimableContractPositionFetcher } from './avalanche/pool-together-v4.claimable.contract-position-fetcher';
import { AvalanchePoolTogetherV4TicketTokenFetcher } from './avalanche/pool-together-v4.ticket-token-fetcher';
import { PoolTogetherV4ApiPrizePoolRegistry } from './common/pool-together-v4.api.prize-pool-registry';
import { PoolTogetherV4ContractFactory } from './contracts';
import { EthereumPoolTogetherV4TicketTokenFetcher } from './ethereum/pool-together-v4.ticket-token-fetcher';
import { OptimismPoolTogetherV4ClaimableContractPositionFetcher } from './optimism/pool-together-v4.claimable.contract-position-fetcher';
import { OptimismPoolTogetherV4TicketTokenFetcher } from './optimism/pool-together-v4.ticket-token-fetcher';
import { PolygonPoolTogetherV4TicketTokenFetcher } from './polygon/pool-together-v4.ticket-token-fetcher';
import POOL_TOGETHER_V4_DEFINITION, { PoolTogetherV4AppDefinition } from './pool-together-v4.definition';

@Register.AppModule({
  appId: POOL_TOGETHER_V4_DEFINITION.id,
  imports: [PoolTogetherV3AppModule],
  providers: [
    AvalanchePoolTogetherV4TicketTokenFetcher,
    AvalanchePoolTogetherV4ClaimableContractPositionFetcher,
    EthereumPoolTogetherV4TicketTokenFetcher,
    OptimismPoolTogetherV4TicketTokenFetcher,
    OptimismPoolTogetherV4ClaimableContractPositionFetcher,
    PolygonPoolTogetherV4TicketTokenFetcher,
    PoolTogetherV4ApiPrizePoolRegistry,
    PoolTogetherV4AppDefinition,
    PoolTogetherV4ContractFactory,
  ],
})
export class PoolTogetherV4AppModule extends AbstractApp() {}
