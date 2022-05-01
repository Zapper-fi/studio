import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';

import { ThalesContractFactory } from './contracts';
import { EthereumThalesBalanceFetcher } from './ethereum/thales.balance-fetcher';
import { EthereumThalesMarketTokenFetcher } from './ethereum/thales.market.token-fetcher';
import { OptimismThalesBalanceFetcher } from './optimism/thales.balance-fetcher';
import { OptimismThalesMarketTokenFetcher } from './optimism/thales.market.token-fetcher';
import { PolygonThalesBalanceFetcher } from './polygon/thales.balance-fetcher';
import { PolygonThalesMarketTokenFetcher } from './polygon/thales.market.token-fetcher';
import { ThalesAppDefinition } from './thales.definition';

@Module({
  providers: [
    ThalesAppDefinition,
    ThalesContractFactory,
    EthereumThalesBalanceFetcher,
    EthereumThalesMarketTokenFetcher,
    PolygonThalesBalanceFetcher,
    PolygonThalesMarketTokenFetcher,
    OptimismThalesBalanceFetcher,
    OptimismThalesMarketTokenFetcher,
  ],
})
export class ThalesAppModule extends AbstractDynamicApp<ThalesAppModule>() {}
