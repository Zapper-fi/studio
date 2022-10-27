import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AuraAppDefinition, AURA_DEFINITION } from './aura.definition';
import { AuraBalancerPoolResolver } from './common/aura.balancer-pool.resolver';
import { AuraLockerRewardResolver } from './common/aura.locker.reward-resolver';
import { AuraRewardPoolResolver } from './common/aura.reward-pool.resolver';
import { AuraBaseRewardPoolUtils } from './common/aura.reward-utils';
import { AuraContractFactory } from './contracts';
import { EthereumAuraBalTokenFetcher } from './ethereum/aura.aura-bal.token-fetcher';
import { EthereumAuraChefContractPositionFetcher } from './ethereum/aura.chef.contract-position-fetcher';
import { EthereumAuraDepositTokenFetcher } from './ethereum/aura.deposit.token-fetcher';
import { EthereumAuraLockerContractPositionFetcher } from './ethereum/aura.locker.contract-position-fetcher';
import { EthereumAuraPoolContractPositionFetcher } from './ethereum/aura.pool.contract-position-fetcher';
import { EthereumAuraStakingContractPositionFetcher } from './ethereum/aura.staking.contract-position-fetcher';

@Register.AppModule({
  appId: AURA_DEFINITION.id,
  providers: [
    AuraAppDefinition,
    AuraContractFactory,
    // helpers
    AuraBalancerPoolResolver,
    AuraLockerRewardResolver,
    AuraRewardPoolResolver,
    AuraBaseRewardPoolUtils,
    // Ethereum
    EthereumAuraBalTokenFetcher,
    EthereumAuraDepositTokenFetcher,
    EthereumAuraChefContractPositionFetcher,
    EthereumAuraPoolContractPositionFetcher,
    EthereumAuraLockerContractPositionFetcher,
    EthereumAuraStakingContractPositionFetcher,
  ],
})
export class AuraAppModule extends AbstractApp() {}
