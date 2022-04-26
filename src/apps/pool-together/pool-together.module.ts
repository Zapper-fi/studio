import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalanchePoolTogetherV4VaultTokenFetcher } from './avalanche/pool-together-v4.vault.token-fetcher';
import { AvalanchePoolTogetherBalanceFetcher } from './avalanche/pool-together.balance-fetcher';
import { CeloPoolTogetherBalanceFetcher } from './celo/pool-together.balance-fetcher';
import { CeloPoolTogetherPrizeTicketTokenFetcher } from './celo/pool-together.prize-ticket.token-fetcher';
import { PoolTogetherContractFactory } from './contracts';
import { EthereumPoolTogetherV4VaultTokenFetcher } from './ethereum/pool-together-v4.vault.token-fetcher';
import { EthereumPoolTogetherBalanceFetcher } from './ethereum/pool-together.balance-fetcher';
import { EthereumPoolTogetherPodTokenFetcher } from './ethereum/pool-together.pod.token-fetcher';
import { EthereumPoolTogetherPrizeTicketTokenFetcher } from './ethereum/pool-together.prize-ticket.token-fetcher';
import { PoolTogetherV4VaultTokenHelper } from './helpers/pool-together-v4.vault-token-helper';
import { PoolTogetherAirdropTokenBalancesHelper } from './helpers/pool-together.airdrop.balance-helper';
import { PoolTogetherClaimableTokenBalancesHelper } from './helpers/pool-together.claimable.balance-helper';
import { PoolTogetherFaucetAddressHelper } from './helpers/pool-together.faucet.address-helper';
import { PoolTogetherPodTokenHelper } from './helpers/pool-together.pod.token-helper';
import { PoolTogetherPrizeTicketTokenHelper } from './helpers/pool-together.prize-ticket.token-helper';
import { PolygonPoolTogetherV4VaultTokenFetcher } from './polygon/pool-together-v4.vault.token-fetcher';
import { PolygonPoolTogetherBalanceFetcher } from './polygon/pool-together.balance-fetcher';
import { PolygonPoolTogetherPrizeTicketTokenFetcher } from './polygon/pool-together.prize-ticket.token-fetcher';
import { PoolTogetherAppDefinition } from './pool-together.definition';

@Module({
  providers: [
    PoolTogetherAppDefinition,
    PoolTogetherContractFactory,
    PoolTogetherAirdropTokenBalancesHelper,
    PoolTogetherClaimableTokenBalancesHelper,
    PoolTogetherFaucetAddressHelper,
    PoolTogetherPodTokenHelper,
    PoolTogetherPrizeTicketTokenHelper,
    PoolTogetherV4VaultTokenHelper,
    AvalanchePoolTogetherBalanceFetcher,
    AvalanchePoolTogetherV4VaultTokenFetcher,
    CeloPoolTogetherBalanceFetcher,
    CeloPoolTogetherPrizeTicketTokenFetcher,
    EthereumPoolTogetherBalanceFetcher,
    EthereumPoolTogetherPodTokenFetcher,
    EthereumPoolTogetherPrizeTicketTokenFetcher,
    EthereumPoolTogetherV4VaultTokenFetcher,
    PolygonPoolTogetherBalanceFetcher,
    PolygonPoolTogetherPrizeTicketTokenFetcher,
    PolygonPoolTogetherV4VaultTokenFetcher,
  ],
})
export class PoolTogetherAppModule extends AbstractApp() {}
