import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { CeloPoolTogetherV3BalanceFetcher } from './celo/pool-together-v3.balance-fetcher';
import { CeloPoolTogetherV3TicketTokenFetcher } from './celo/pool-together-v3.ticket-token-fetcher';
import { PoolTogetherV3ContractFactory } from './contracts';
import { EthereumPoolTogetherV3BalanceFetcher } from './ethereum/pool-together-v3.balance-fetcher';
import { EthereumPoolTogetherV3PodTokenFetcher } from './ethereum/pool-together-v3.pod-token-fetcher';
import { EthereumPoolTogetherV3TicketTokenFetcher } from './ethereum/pool-together-v3.ticket-token-fetcher';
import { PoolTogetherV3AirdropTokenBalancesHelper } from './helpers/pool-together-v3.airdrop.balance-helper';
import { PoolTogetherV3ApiPrizePoolRegistry } from './helpers/pool-together-v3.api.prize-pool-registry';
import { PoolTogetherV3ClaimableTokenBalancesHelper } from './helpers/pool-together-v3.claimable.balance-helper';
import { PoolTogetherV3FaucetAddressHelper } from './helpers/pool-together-v3.faucet.address-helper';
import { PoolTogetherV3PodTokenHelper } from './helpers/pool-together-v3.pod.token-helper';
import { PoolTogetherV3PrizePoolTokenHelper } from './helpers/pool-together-v3.prize-pool.token-helper';
import { PolygonPoolTogetherV3BalanceFetcher } from './polygon/pool-together-v3.balance-fetcher';
import { PolygonPoolTogetherV3TicketTokenFetcher } from './polygon/pool-together-v3.ticket-token-fetcher';
import POOL_TOGETHER_V3_DEFINITION, { PoolTogetherV3AppDefinition } from './pool-together-v3.definition';

@Register.AppModule({
  appId: POOL_TOGETHER_V3_DEFINITION.id,
  providers: [
    PoolTogetherV3AppDefinition,
    PoolTogetherV3ContractFactory,
    PoolTogetherV3ApiPrizePoolRegistry,
    // Helpers
    PoolTogetherV3AirdropTokenBalancesHelper,
    PoolTogetherV3ClaimableTokenBalancesHelper,
    PoolTogetherV3FaucetAddressHelper,
    PoolTogetherV3PodTokenHelper,
    PoolTogetherV3PrizePoolTokenHelper,
    // Celo
    CeloPoolTogetherV3BalanceFetcher,
    CeloPoolTogetherV3TicketTokenFetcher,
    // Ethereum
    EthereumPoolTogetherV3BalanceFetcher,
    EthereumPoolTogetherV3PodTokenFetcher,
    EthereumPoolTogetherV3TicketTokenFetcher,
    // Polygon
    PolygonPoolTogetherV3BalanceFetcher,
    PolygonPoolTogetherV3TicketTokenFetcher,
  ],
})
export class PoolTogetherV3AppModule extends AbstractApp() {}
