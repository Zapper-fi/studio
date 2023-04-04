import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumLyraAvalonOptionsContractPositionFetcher } from './arbitrum/lyra-avalon.options.contract-position-fetcher';
import { ArbitrumLyraAvalonStkLyraClaimableContractPositionFetcher } from './arbitrum/lyra-avalon.stk-lyra-claimable.contract-position-fetcher';
import { ArbitrumLyraAvalonStkLyraTokenFetcher } from './arbitrum/lyra-avalon.stk-lyra.token-fetcher';
import { LyraAvalonContractFactory } from './contracts';
import { EthereumLyraAvalonStakingContractPositionFetcher } from './ethereum/lyra-avalon.staking.contract-position-fetcher';
import { EthereumLyraAvalonStkLyraTokenFetcher } from './ethereum/lyra-avalon.stk-lyra.token-fetcher';
import { OptimismLyraAvalonOptionsContractPositionFetcher } from './optimism/lyra-avalon.options.contract-position-fetcher';
import { OptimismLyraAvalonPoolTokenFetcher } from './optimism/lyra-avalon.pool.token-fetcher';
import { OptimismLyraAvalonStakingContractPositionFetcher } from './optimism/lyra-avalon.staking.contract-position-fetcher';
import { OptimismLyraAvalonStkLyraClaimableContractPositionFetcher } from './optimism/lyra-avalon.stk-lyra-claimable.contract-position-fetcher';
import { OptimismLyraAvalonStkLyraTokenFetcher } from './optimism/lyra-avalon.stk-lyra.token-fetcher';

@Module({
  providers: [
    LyraAvalonContractFactory,
    // Arbitrum
    ArbitrumLyraAvalonOptionsContractPositionFetcher,
    ArbitrumLyraAvalonStkLyraTokenFetcher,
    ArbitrumLyraAvalonStkLyraClaimableContractPositionFetcher,
    // Optimism
    OptimismLyraAvalonOptionsContractPositionFetcher,
    OptimismLyraAvalonPoolTokenFetcher,
    OptimismLyraAvalonStakingContractPositionFetcher,
    OptimismLyraAvalonStkLyraTokenFetcher,
    OptimismLyraAvalonStkLyraClaimableContractPositionFetcher,
    // Ethereum
    EthereumLyraAvalonStkLyraTokenFetcher,
    EthereumLyraAvalonStakingContractPositionFetcher,
  ],
})
export class LyraAvalonAppModule extends AbstractApp() {}
