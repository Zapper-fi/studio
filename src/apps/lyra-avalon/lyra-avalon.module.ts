import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { LyraAvalonContractFactory } from './contracts';
import { EthereumLyraAvalonStkLyraTokenFetcher } from './ethereum/lyra-avalon.stk-lyra.token-fetcher';
import { EthereumLyraAvalonStakingContractPositionFetcher } from './ethereum/lyra-avalon.staking.contract-position-fetcher';
import { OptimismLyraAvalonOptionsContractPositionFetcher } from './optimism/lyra-avalon.options.contract-position-fetcher';
import { OptimismLyraAvalonPoolTokenFetcher } from './optimism/lyra-avalon.pool.token-fetcher';
import { OptimismLyraAvalonStakingContractPositionFetcher } from './optimism/lyra-avalon.staking.contract-position-fetcher';
import { OptimismLyraAvalonStkLyraClaimableContractPositionFetcher } from './optimism/lyra-avalon.stk-lyra-claimable.contract-position-fetcher';
import { OptimismLyraAvalonStkLyraTokenFetcher } from './optimism/lyra-avalon.stk-lyra.token-fetcher';

@Module({
  providers: [
    LyraAvalonContractFactory,
    OptimismLyraAvalonOptionsContractPositionFetcher,
    OptimismLyraAvalonPoolTokenFetcher,
    OptimismLyraAvalonStakingContractPositionFetcher,
    OptimismLyraAvalonStkLyraTokenFetcher,
    OptimismLyraAvalonStkLyraClaimableContractPositionFetcher,
    EthereumLyraAvalonStkLyraTokenFetcher,
    EthereumLyraAvalonStakingContractPositionFetcher,
  ],
})
export class LyraAvalonAppModule extends AbstractApp() { }
