import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { SynthetixSingleStakingFarmContractPositionHelper } from '~apps/synthetix';

import { ThalesContractFactory } from './contracts';
import { EthereumThalesBalanceFetcher } from './ethereum/thales.balance-fetcher';
import { EthereumThalesMarketTokenFetcher } from './ethereum/thales.market.token-fetcher';
import { EthereumThalesStakingContractPositionFetcher } from './ethereum/thales.staking.contract-position-fetcher';
import { OptimismThalesBalanceFetcher } from './optimism/thales.balance-fetcher';
import { OptimismThalesMarketTokenFetcher } from './optimism/thales.market.token-fetcher';
import { OptimismThalesStakingContractPositionFetcher } from './optimism/thales.staking.contract-position-fetcher';
import { PolygonThalesBalanceFetcher } from './polygon/thales.balance-fetcher';
import { PolygonThalesMarketTokenFetcher } from './polygon/thales.market.token-fetcher';
import { PolygonThalesStakingContractPositionFetcher } from './polygon/thales.staking.contract-position-fetcher';
import { ThalesAppDefinition } from './thales.definition';

@Module({
  providers: [
    ThalesAppDefinition,
    ThalesContractFactory,
    EthereumThalesBalanceFetcher,
    EthereumThalesMarketTokenFetcher,
    EthereumThalesStakingContractPositionFetcher,
    PolygonThalesBalanceFetcher,
    PolygonThalesMarketTokenFetcher,
    PolygonThalesStakingContractPositionFetcher,
    OptimismThalesBalanceFetcher,
    OptimismThalesMarketTokenFetcher,
    OptimismThalesStakingContractPositionFetcher,
  ],
})
export class ThalesAppModule extends AbstractApp() { }
