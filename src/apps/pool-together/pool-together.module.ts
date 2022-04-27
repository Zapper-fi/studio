import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalanchePoolTogetherV4TicketTokenFetcher } from './avalanche/pool-together.v4-ticket.token-fetcher';
import { AvalanchePoolTogetherBalanceFetcher } from './avalanche/pool-together.balance-fetcher';
import { CeloPoolTogetherBalanceFetcher } from './celo/pool-together.balance-fetcher';
import { CeloPoolTogetherV3TicketTokenFetcher } from './celo/pool-together.v3-ticket.token-fetcher';
import { PoolTogetherContractFactory } from './contracts';
import { EthereumPoolTogetherV4TicketTokenFetcher } from './ethereum/pool-together.v4-ticket.token-fetcher';
import { EthereumPoolTogetherBalanceFetcher } from './ethereum/pool-together.balance-fetcher';
import { EthereumPoolTogetherPodTokenFetcher } from './ethereum/pool-together.pod.token-fetcher';
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
import { PoolTogetherAppDefinition } from './pool-together.definition';

@Module({
  providers: [
    PoolTogetherAppDefinition,
    PoolTogetherContractFactory,
    PoolTogetherAirdropTokenBalancesHelper,
    PoolTogetherClaimableTokenBalancesHelper,
    PoolTogetherFaucetAddressHelper,
    PoolTogetherV3PodTokenHelper,
    PoolTogetherV3PrizePoolTokenHelper,
    PoolTogetherV4PrizePoolTokenHelper,
    AvalanchePoolTogetherBalanceFetcher,
    AvalanchePoolTogetherV4TicketTokenFetcher,
    CeloPoolTogetherBalanceFetcher,
    CeloPoolTogetherV3TicketTokenFetcher,
    EthereumPoolTogetherBalanceFetcher,
    EthereumPoolTogetherPodTokenFetcher,
    EthereumPoolTogetherV3TicketTokenFetcher,
    EthereumPoolTogetherV4TicketTokenFetcher,
    PolygonPoolTogetherBalanceFetcher,
    PolygonPoolTogetherV3TicketTokenFetcher,
    PolygonPoolTogetherV4TicketTokenFetcher,
  ],
})
export class PoolTogetherAppModule extends AbstractApp() {}
