import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumAuraDepositTokenFetcher } from './arbitrum/aura.deposit.token-fetcher';
import { ArbitrumAuraLpFarmContractPositionFetcher } from './arbitrum/aura.lp-farm.contract-position-fetcher';
import { BaseAuraDepositTokenFetcher } from './base/aura.deposit.token-fetcher';
import { BaseAuraLpFarmContractPositionFetcher } from './base/aura.lp-farm.contract-position-fetcher';
import { AuraBalancerPoolResolver } from './common/aura.balancer-pool.resolver';
import { AuraViemContractFactory } from './contracts';
import { EthereumAuraAuraBalCompounderContractPositionFetcher } from './ethereum/aura.aura-bal-compounder.contract-position-fetcher';
import { EthereumAuraAuraBalStakingContractPositionFetcher } from './ethereum/aura.aura-bal-staking.contract-position-fetcher';
import { EthereumAuraAuraBalTokenFetcher } from './ethereum/aura.aura-bal.token-fetcher';
import { EthereumAuraChefContractPositionFetcher } from './ethereum/aura.chef.contract-position-fetcher';
import { EthereumAuraDepositTokenFetcher } from './ethereum/aura.deposit.token-fetcher';
import { EthereumAuraLockerContractPositionFetcher } from './ethereum/aura.locker.contract-position-fetcher';
import { EthereumAuraLpFarmContractPositionFetcher } from './ethereum/aura.lp-farm.contract-position-fetcher';
import { OptimismAuraDepositTokenFetcher } from './optimism/aura.deposit.token-fetcher';
import { OptimismAuraLpFarmContractPositionFetcher } from './optimism/aura.lp-farm.contract-position-fetcher';

@Module({
  providers: [
    AuraViemContractFactory,
    // helpers
    AuraBalancerPoolResolver,
    // Arbitrum
    ArbitrumAuraDepositTokenFetcher,
    ArbitrumAuraLpFarmContractPositionFetcher,
    // Base
    BaseAuraDepositTokenFetcher,
    BaseAuraLpFarmContractPositionFetcher,
    // Ethereum
    EthereumAuraAuraBalTokenFetcher,
    EthereumAuraChefContractPositionFetcher,
    EthereumAuraDepositTokenFetcher,
    EthereumAuraLpFarmContractPositionFetcher,
    EthereumAuraLockerContractPositionFetcher,
    EthereumAuraAuraBalStakingContractPositionFetcher,
    EthereumAuraAuraBalCompounderContractPositionFetcher,
    // Optimism
    OptimismAuraDepositTokenFetcher,
    OptimismAuraLpFarmContractPositionFetcher,
  ],
})
export class AuraAppModule extends AbstractApp() {}
