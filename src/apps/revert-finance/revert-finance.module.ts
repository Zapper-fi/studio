import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV3LiquidityContractPositionBuilder } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.contract-position-builder';
import { UniswapV3ViemContractFactory } from '~apps/uniswap-v3/contracts';

import { ArbitrumRevertFinanceCompoundorRewardsContractPositionFetcher } from './arbitrum/revert-finance.compoundor-rewards.contract-position-fetcher';
import { ArbitrumRevertFinanceCompoundorContractPositionFetcher } from './arbitrum/revert-finance.compoundor.contract-position-fetcher';
import { RevertFinanceViemContractFactory } from './contracts';
import { EthereumRevertFinanceCompoundorRewardsContractPositionFetcher } from './ethereum/revert-finance.compoundor-rewards.contract-position-fetcher';
import { EthereumRevertFinanceCompoundorContractPositionFetcher } from './ethereum/revert-finance.compoundor.contract-position-fetcher';
import { OptimismRevertFinanceCompoundorRewardsContractPositionFetcher } from './optimism/revert-finance.compoundor-rewards.contract-position-fetcher';
import { OptimismRevertFinanceCompoundorContractPositionFetcher } from './optimism/revert-finance.compoundor.contract-position-fetcher';
import { PolygonRevertFinanceCompoundorRewardsContractPositionFetcher } from './polygon/revert-finance.compoundor-rewards.contract-position-fetcher';
import { PolygonRevertFinanceCompoundorContractPositionFetcher } from './polygon/revert-finance.compoundor.contract-position-fetcher';

@Module({
  providers: [
    RevertFinanceViemContractFactory,
    UniswapV3ViemContractFactory,
    UniswapV3LiquidityContractPositionBuilder,
    ArbitrumRevertFinanceCompoundorContractPositionFetcher,
    ArbitrumRevertFinanceCompoundorRewardsContractPositionFetcher,
    EthereumRevertFinanceCompoundorContractPositionFetcher,
    EthereumRevertFinanceCompoundorRewardsContractPositionFetcher,
    OptimismRevertFinanceCompoundorContractPositionFetcher,
    OptimismRevertFinanceCompoundorRewardsContractPositionFetcher,
    PolygonRevertFinanceCompoundorContractPositionFetcher,
    PolygonRevertFinanceCompoundorRewardsContractPositionFetcher,
  ],
})
export class RevertFinanceAppModule extends AbstractApp() {}
