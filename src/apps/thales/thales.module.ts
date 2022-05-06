import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ThalesContractFactory } from './contracts';
import { EthereumThalesBalanceFetcher } from './ethereum/thales.balance-fetcher';
import { EthereumThalesMarketTokenFetcher } from './ethereum/thales.market.token-fetcher';
import { EthereumThalesStakingTokenFetcher } from './ethereum/thales.staking.token-fetcher';
import { OptimismThalesBalanceFetcher } from './optimism/thales.balance-fetcher';
import { OptimismThalesMarketTokenFetcher } from './optimism/thales.market.token-fetcher';
import { OptimismThalesStakingTokenFetcher } from './optimism/thales.staking.token-fetcher';
import { PolygonThalesBalanceFetcher } from './polygon/thales.balance-fetcher';
import { PolygonThalesMarketTokenFetcher } from './polygon/thales.market.token-fetcher';
import { PolygonThalesStakingTokenFetcher } from './polygon/thales.staking.token-fetcher';
import { ThalesAppDefinition } from './thales.definition';

@Module({
  providers: [
    ThalesAppDefinition,
    ThalesContractFactory,
    EthereumThalesBalanceFetcher,
    EthereumThalesMarketTokenFetcher,
    EthereumThalesStakingTokenFetcher,
    PolygonThalesBalanceFetcher,
    PolygonThalesMarketTokenFetcher,
    PolygonThalesStakingTokenFetcher,
    OptimismThalesBalanceFetcher,
    OptimismThalesMarketTokenFetcher,
    OptimismThalesStakingTokenFetcher,
  ],
})
export class ThalesAppModule extends AbstractApp() {}
