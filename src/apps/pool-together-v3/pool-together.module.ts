import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { CeloPoolTogetherBalanceFetcher } from './celo/pool-together.balance-fetcher';
import { CeloPoolTogetherV3TicketTokenFetcher } from './celo/pool-together.v3-ticket.token-fetcher';
import { PoolTogetherContractFactory } from './contracts';
import { EthereumPoolTogetherBalanceFetcher } from './ethereum/pool-together.balance-fetcher';
import { EthereumPoolTogetherPodTokenFetcher } from './ethereum/pool-together.v3-pod.token-fetcher';
import { EthereumPoolTogetherV3TicketTokenFetcher } from './ethereum/pool-together.v3-ticket.token-fetcher';
import { PoolTogetherClaimableTokenBalancesHelper } from './helpers/pool-together-v3.claimable.balance-helper';
import { PoolTogetherFaucetAddressHelper } from './helpers/pool-together-v3.faucet.address-helper';
import { PoolTogetherV3PodTokenHelper } from './helpers/pool-together-v3.pod.token-helper';
import { PoolTogetherV3PrizePoolTokenHelper } from './helpers/pool-together-v3.prize-pool.token-helper';
import { PoolTogetherAirdropTokenBalancesHelper } from './helpers/pool-together.airdrop.balance-helper';
import { PoolTogetherApiPrizePoolRegistry } from './helpers/pool-together.api.prize-pool-registry';
import { PolygonPoolTogetherBalanceFetcher } from './polygon/pool-together.balance-fetcher';
import { PolygonPoolTogetherV3TicketTokenFetcher } from './polygon/pool-together.v3-ticket.token-fetcher';
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
    PoolTogetherFaucetAddressHelper,
    PoolTogetherV3PodTokenHelper,
    PoolTogetherV3PrizePoolTokenHelper,
    // Celo
    CeloPoolTogetherBalanceFetcher,
    CeloPoolTogetherV3TicketTokenFetcher,
    // Ethereum
    EthereumPoolTogetherBalanceFetcher,
    EthereumPoolTogetherPodTokenFetcher,
    EthereumPoolTogetherV3TicketTokenFetcher,
    // Polygon
    PolygonPoolTogetherBalanceFetcher,
    PolygonPoolTogetherV3TicketTokenFetcher,
  ],
})
export class PoolTogetherAppModule extends AbstractApp() {}
