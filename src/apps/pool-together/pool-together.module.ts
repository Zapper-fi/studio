import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalanchePoolTogetherV4TicketTokenFetcher } from './avalanche/pool-together.v4-ticket.token-fetcher';
import { AvalanchePoolTogetherBalanceFetcher } from './avalanche/pool-together.balance-fetcher';
import { CeloPoolTogetherBalanceFetcher } from './celo/pool-together.balance-fetcher';
import { CeloPoolTogetherV3TicketTokenFetcher } from './celo/pool-together.v3-ticket.token-fetcher';
import { PoolTogetherContractFactory } from './contracts';
import { EthereumPoolTogetherV4TicketTokenFetcher } from './ethereum/pool-together.v4-ticket.token-fetcher';
import { EthereumPoolTogetherBalanceFetcher } from './ethereum/pool-together.balance-fetcher';
import { EthereumPoolTogetherPodTokenFetcher } from './ethereum/pool-together.v3-pod.token-fetcher';
import { EthereumPoolTogetherV3TicketTokenFetcher } from './ethereum/pool-together.v3-ticket.token-fetcher';
import { PoolTogetherV4PrizePoolTokenHelper } from './helpers/pool-together-v4.prize-pool.token-helper';
import { PoolTogetherAirdropTokenBalancesHelper } from './helpers/pool-together.airdrop.balance-helper';
import { PoolTogetherClaimableTokenBalancesHelper } from './helpers/pool-together-v3.claimable.balance-helper';
import { PoolTogetherFaucetAddressHelper } from './helpers/pool-together-v3.faucet.address-helper';
import { PoolTogetherV3PodTokenHelper } from './helpers/pool-together-v3.pod.token-helper';
import { PoolTogetherV3PrizePoolTokenHelper } from './helpers/pool-together-v3.prize-pool.token-helper';
import { PolygonPoolTogetherV4TicketTokenFetcher } from './polygon/pool-together.v4-ticket.token-fetcher';
import { PolygonPoolTogetherBalanceFetcher } from './polygon/pool-together.balance-fetcher';
import { PolygonPoolTogetherV3TicketTokenFetcher } from './polygon/pool-together.v3-ticket.token-fetcher';
import { PoolTogetherApiPrizePoolRegistry } from './helpers/pool-together.api.prize-pool-registry';
import { PolygonPoolTogetherTvlFetcher } from './polygon/pool-together.tvl-fetcher';
import { EthereumPoolTogetherTvlFetcher } from './ethereum/pool-together.tvl-fetcher';
import { CeloPoolTogetherTvlFetcher } from './celo/pool-together.tvl-fetcher';
import { AvalanchePoolTogetherTvlFetcher } from './avalanche/pool-together.tvl-fetcher';
import POOL_TOGETHER_DEFINITION, { PoolTogetherAppDefinition } from './pool-together.definition';

@Register.AppModule({
  appId: POOL_TOGETHER_DEFINITION.id,
  providers: [
    PoolTogetherAppDefinition,
    PoolTogetherApiPrizePoolRegistry,
    PoolTogetherContractFactory,
    PoolTogetherAirdropTokenBalancesHelper,
    PoolTogetherClaimableTokenBalancesHelper,
    PoolTogetherFaucetAddressHelper,
    PoolTogetherV3PodTokenHelper,
    PoolTogetherV3PrizePoolTokenHelper,
    PoolTogetherV4PrizePoolTokenHelper,
    AvalanchePoolTogetherTvlFetcher,
    AvalanchePoolTogetherBalanceFetcher,
    AvalanchePoolTogetherV4TicketTokenFetcher,
    CeloPoolTogetherTvlFetcher,
    CeloPoolTogetherBalanceFetcher,
    CeloPoolTogetherV3TicketTokenFetcher,
    EthereumPoolTogetherTvlFetcher,
    EthereumPoolTogetherBalanceFetcher,
    EthereumPoolTogetherPodTokenFetcher,
    EthereumPoolTogetherV3TicketTokenFetcher,
    EthereumPoolTogetherV4TicketTokenFetcher,
    PolygonPoolTogetherTvlFetcher,
    PolygonPoolTogetherBalanceFetcher,
    PolygonPoolTogetherV3TicketTokenFetcher,
    PolygonPoolTogetherV4TicketTokenFetcher,
  ],
})
export class PoolTogetherAppModule extends AbstractApp() {}
