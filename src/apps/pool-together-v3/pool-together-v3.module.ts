import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { CeloPoolTogetherV3ClaimableContractPositionFetcher } from './celo/pool-together-v3.claimable.contract-position-fetcher';
import { CeloPoolTogetherV3SponsorshipTokenFetcher } from './celo/pool-together-v3.sponsorship.token-fetcher';
import { CeloPoolTogetherV3TicketTokenFetcher } from './celo/pool-together-v3.ticket.token-fetcher';
import { PoolTogetherV3ApiPrizePoolRegistry } from './common/pool-together-v3.api.prize-pool-registry';
import { PoolTogetherV3LogProvider } from './common/pool-together-v3.log-provider';
import { PoolTogetherV3ContractFactory } from './contracts';
import { EthereumPoolTogetherV3AirdropTokenFetcher } from './ethereum/pool-together-v3.airdrop.contract-position-fetcher';
import { EthereumPoolTogetherV3ClaimableContractPositionFetcher } from './ethereum/pool-together-v3.claimable.contract-position-fetcher';
import { EthereumPoolTogetherV3CommunityTicketTokenFetcher } from './ethereum/pool-together-v3.community-ticket.token-fetcher';
import { EthereumPoolTogetherV3PodTokenFetcher } from './ethereum/pool-together-v3.pod.token-fetcher';
import { EthereumPoolTogetherV3SponsorshipTokenFetcher } from './ethereum/pool-together-v3.sponsorship.token-fetcher';
import { EthereumPoolTogetherV3TicketTokenFetcher } from './ethereum/pool-together-v3.ticket.token-fetcher';
import { GnosisPoolTogetherV3CommunityTicketTokenFetcher } from './gnosis/pool-together-v3.community-ticket.token-fetcher';
import { PolygonPoolTogetherV3ClaimableContractPositionFetcher } from './polygon/pool-together-v3.claimable.contract-position-fetcher';
import { PolygonPoolTogetherV3CommunityTicketTokenFetcher } from './polygon/pool-together-v3.community-ticket.token-fetcher';
import { PolygonPoolTogetherV3SponsorshipTokenFetcher } from './polygon/pool-together-v3.sponsorship.token-fetcher';
import { PolygonPoolTogetherV3TicketTokenFetcher } from './polygon/pool-together-v3.ticket.token-fetcher';
import POOL_TOGETHER_V3_DEFINITION, { PoolTogetherV3AppDefinition } from './pool-together-v3.definition';

@Register.AppModule({
  appId: POOL_TOGETHER_V3_DEFINITION.id,
  providers: [
    PoolTogetherV3ApiPrizePoolRegistry,
    PoolTogetherV3AppDefinition,
    PoolTogetherV3ContractFactory,
    PoolTogetherV3LogProvider,
    // Celo
    CeloPoolTogetherV3ClaimableContractPositionFetcher,
    CeloPoolTogetherV3SponsorshipTokenFetcher,
    CeloPoolTogetherV3TicketTokenFetcher,
    // Ethereum
    EthereumPoolTogetherV3AirdropTokenFetcher,
    EthereumPoolTogetherV3ClaimableContractPositionFetcher,
    EthereumPoolTogetherV3CommunityTicketTokenFetcher,
    EthereumPoolTogetherV3PodTokenFetcher,
    EthereumPoolTogetherV3SponsorshipTokenFetcher,
    EthereumPoolTogetherV3TicketTokenFetcher,
    // Gnosis
    GnosisPoolTogetherV3CommunityTicketTokenFetcher,
    // Polygon
    PolygonPoolTogetherV3ClaimableContractPositionFetcher,
    PolygonPoolTogetherV3CommunityTicketTokenFetcher,
    PolygonPoolTogetherV3SponsorshipTokenFetcher,
    PolygonPoolTogetherV3TicketTokenFetcher,
  ],
  exports: [PoolTogetherV3ApiPrizePoolRegistry],
})
export class PoolTogetherV3AppModule extends AbstractApp() {}
