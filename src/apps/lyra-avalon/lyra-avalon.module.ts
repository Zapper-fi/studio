import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumLyraAvalonOptionsContractPositionFetcher } from './arbitrum/lyra-avalon.options.contract-position-fetcher';
import { ArbitrumLyraAvalonPoolTokenFetcher } from './arbitrum/lyra-avalon.pool.token-fetcher';
import { LyraAvalonViemContractFactory } from './contracts';
import { EthereumLyraAvalonStakingContractPositionFetcher } from './ethereum/lyra-avalon.staking.contract-position-fetcher';
import { EthereumLyraAvalonStkLyraClaimableContractPositionFetcher } from './ethereum/lyra-avalon.stk-lyra-claimable.contract-position-fetcher';
import { OptimismLyraAvalonOptionsContractPositionFetcher } from './optimism/lyra-avalon.options.contract-position-fetcher';
import { OptimismLyraAvalonPoolTokenFetcher } from './optimism/lyra-avalon.pool.token-fetcher';
import { OptimismLyraAvalonStakingContractPositionFetcher } from './optimism/lyra-avalon.staking.contract-position-fetcher';
import { OptimismLyraAvalonStkLyraClaimableContractPositionFetcher } from './optimism/lyra-avalon.stk-lyra-claimable.contract-position-fetcher';

@Module({
  providers: [
    LyraAvalonViemContractFactory,
    // Arbitrum
    ArbitrumLyraAvalonOptionsContractPositionFetcher,
    ArbitrumLyraAvalonPoolTokenFetcher,
    // Ethereum
    EthereumLyraAvalonStakingContractPositionFetcher,
    EthereumLyraAvalonStkLyraClaimableContractPositionFetcher,
    // Optimism
    OptimismLyraAvalonOptionsContractPositionFetcher,
    OptimismLyraAvalonPoolTokenFetcher,
    OptimismLyraAvalonStakingContractPositionFetcher,
    OptimismLyraAvalonStkLyraClaimableContractPositionFetcher,
  ],
})
export class LyraAvalonAppModule extends AbstractApp() {}
