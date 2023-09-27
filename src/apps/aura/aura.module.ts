import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumAuraDepositTokenFetcher } from './arbitrum/aura.deposit.token-fetcher';
import { AuraBalancerPoolResolver } from './common/aura.balancer-pool.resolver';
import { AuraContractFactory } from './contracts';
import { EthereumAuraAuraBalCompounderContractPositionFetcher } from './ethereum/aura.aura-bal-compounder.contract-position-fetcher';
import { EthereumAuraAuraBalStakingContractPositionFetcher } from './ethereum/aura.aura-bal-staking.contract-position-fetcher';
import { EthereumAuraAuraBalTokenFetcher } from './ethereum/aura.aura-bal.token-fetcher';
import { EthereumAuraChefContractPositionFetcher } from './ethereum/aura.chef.contract-position-fetcher';
import { EthereumAuraDepositTokenFetcher } from './ethereum/aura.deposit.token-fetcher';
import { EthereumAuraLockerContractPositionFetcher } from './ethereum/aura.locker.contract-position-fetcher';
import { EthereumAuraLpFarmContractPositionFetcher } from './ethereum/aura.lp-farm.contract-position-fetcher';
import { EthereumAuraStakedAuraBalTokenFetcher } from './ethereum/aura.staked-aura-bal.token-fetcher';
import { OptimismAuraDepositTokenFetcher } from './optimism/aura.deposit.token-fetcher';

@Module({
  providers: [
    AuraContractFactory,
    // helpers
    AuraBalancerPoolResolver,
    // Arbitrum
    ArbitrumAuraDepositTokenFetcher,
    // Ethereum
    EthereumAuraAuraBalTokenFetcher,
    EthereumAuraChefContractPositionFetcher,
    EthereumAuraDepositTokenFetcher,
    EthereumAuraLpFarmContractPositionFetcher,
    EthereumAuraLockerContractPositionFetcher,
    EthereumAuraAuraBalStakingContractPositionFetcher,
    EthereumAuraStakedAuraBalTokenFetcher,
    EthereumAuraAuraBalCompounderContractPositionFetcher,
    // Optimism
    OptimismAuraDepositTokenFetcher,
  ],
})
export class AuraAppModule extends AbstractApp() {}
