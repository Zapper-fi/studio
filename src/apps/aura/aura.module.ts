import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { BalancerV2AppModule } from '~apps/balancer-v2';
import { SynthetixAppModule } from '~apps/synthetix';

import { AuraAppDefinition, AURA_DEFINITION } from './aura.definition';
import { AuraContractFactory } from './contracts';
import { EthereumAuraBalTokenFetcher } from './ethereum/aura.aura-bal.token-fetcher';
import { EthereumAuraBalanceFetcher } from './ethereum/aura.balance-fetcher';
import { EthereumAuraChefContractPositionFetcher } from './ethereum/aura.chef.contract-position-fetcher';
import { EthereumAuraDepositTokenFetcher } from './ethereum/aura.deposit.token-fetcher';
import { EthereumAuraLockerContractPositionFetcher } from './ethereum/aura.locker.contract-position-fetcher';
import { EthereumAuraPoolContractPositionFetcher } from './ethereum/aura.pool.contract-position-fetcher';
import { EthereumAuraStakingContractPositionFetcher } from './ethereum/aura.staking.contract-position-fetcher';
import { AuraBalancerPoolsHelper } from './helpers/aura.balancer-pools-helper';
import { AuraBaseRewardPoolHelper } from './helpers/aura.base-reward-pool-helper';

@Register.AppModule({
  appId: AURA_DEFINITION.id,
  imports: [SynthetixAppModule, BalancerV2AppModule],
  providers: [
    AuraAppDefinition,
    AuraContractFactory,
    // Ethereum
    EthereumAuraBalanceFetcher,
    EthereumAuraBalTokenFetcher,
    EthereumAuraDepositTokenFetcher,
    EthereumAuraChefContractPositionFetcher,
    EthereumAuraPoolContractPositionFetcher,
    EthereumAuraLockerContractPositionFetcher,
    EthereumAuraStakingContractPositionFetcher,
    // Helpers
    AuraBalancerPoolsHelper,
    AuraBaseRewardPoolHelper,
  ],
})
export class AuraAppModule extends AbstractApp() {}
