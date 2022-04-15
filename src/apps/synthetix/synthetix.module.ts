import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';

import { SynthetixContractFactory } from './contracts';
import { EthereumSynthetixBalanceFetcher } from './ethereum/synthetix.balance-fetcher';
import { EthereumSynthetixFarmContractPositionFetcher } from './ethereum/synthetix.farm.contract-position-fetcher';
import { EthereumSynthetixHoldersCacheManager } from './ethereum/synthetix.holders.cache-manager';
import { EthereumSynthetixSynthTokenFetcher } from './ethereum/synthetix.synth.token-fetcher';
import { EthereumSynthetixTvlFetcher } from './ethereum/synthetix.tvl-fetcher';
import { SynthetixMintrBalanceHelper } from './helpers/synthetix.mintr.balance-helper';
import { SynthetixSingleStakingFarmContractPositionBalanceHelper } from './helpers/synthetix.single-staking-farm-contract-position-balance-helper';
import { SynthetixSingleStakingFarmContractPositionHelper } from './helpers/synthetix.single-staking-farm-contract-position-helper';
import { SynthetixSingleStakingIsActiveStrategy } from './helpers/synthetix.single-staking.is-active-strategy';
import { SynthetixSingleStakingRoiStrategy } from './helpers/synthetix.single-staking.roi-strategy';
import { SynthetixSynthBalanceHelper } from './helpers/synthetix.synth.balance-helper';
import { SynthetixSynthTokenHelper } from './helpers/synthetix.synth.token-helper';
import { OptimismSynthetixBalanceFetcher } from './optimism/synthetix.balance-fetcher';
import { OptimismSynthetixHoldersCacheManager } from './optimism/synthetix.holders.cache-manager';
import { OptimismSynthetixSynthTokenFetcher } from './optimism/synthetix.synth.token-fetcher';
import { OptimismSynthetixTvlFetcher } from './optimism/synthetix.tvl-fetcher';
import { SynthetixAppDefinition } from './synthetix.definition';

@Module({
  providers: [
    SynthetixAppDefinition,
    SynthetixContractFactory,
    SynthetixSingleStakingIsActiveStrategy,
    SynthetixSingleStakingRoiStrategy,
    SynthetixSingleStakingFarmContractPositionHelper,
    SynthetixSingleStakingFarmContractPositionBalanceHelper,
    SynthetixMintrBalanceHelper,
    SynthetixSynthBalanceHelper,
    SynthetixSynthTokenHelper,
    // Ethereum
    EthereumSynthetixBalanceFetcher,
    EthereumSynthetixFarmContractPositionFetcher,
    EthereumSynthetixSynthTokenFetcher,
    EthereumSynthetixTvlFetcher,
    EthereumSynthetixHoldersCacheManager,
    // Optimism
    OptimismSynthetixBalanceFetcher,
    OptimismSynthetixSynthTokenFetcher,
    OptimismSynthetixTvlFetcher,
    OptimismSynthetixHoldersCacheManager,
  ],
  exports: [
    SynthetixContractFactory,
    SynthetixSingleStakingIsActiveStrategy,
    SynthetixSingleStakingRoiStrategy,
    SynthetixSingleStakingFarmContractPositionHelper,
    SynthetixSingleStakingFarmContractPositionBalanceHelper,
  ],
})
export class SynthetixAppModule extends AbstractDynamicApp<SynthetixAppModule>() {}
