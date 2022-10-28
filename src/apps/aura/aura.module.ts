import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AuraAppDefinition, AURA_DEFINITION } from './aura.definition';
import { AuraBalancerPoolResolver } from './common/aura.balancer-pool.resolver';
import { AuraContractFactory } from './contracts';
import { EthereumAuraAuraBalStakingContractPositionFetcher } from './ethereum/aura.aura-bal-staking.contract-position-fetcher';
import { EthereumAuraAuraBalTokenFetcher } from './ethereum/aura.aura-bal.token-fetcher';
import { EthereumAuraChefContractPositionFetcher } from './ethereum/aura.chef.contract-position-fetcher';
import { EthereumAuraDepositTokenFetcher } from './ethereum/aura.deposit.token-fetcher';
import { EthereumAuraLockerContractPositionFetcher } from './ethereum/aura.locker.contract-position-fetcher';
import { EthereumAuraLpFarmContractPositionFetcher } from './ethereum/aura.lp-farm.contract-position-fetcher';

@Register.AppModule({
  appId: AURA_DEFINITION.id,
  providers: [
    AuraAppDefinition,
    AuraContractFactory,
    // helpers
    AuraBalancerPoolResolver,
    // Ethereum
    EthereumAuraAuraBalTokenFetcher,
    EthereumAuraDepositTokenFetcher,
    EthereumAuraChefContractPositionFetcher,
    EthereumAuraLpFarmContractPositionFetcher,
    EthereumAuraLockerContractPositionFetcher,
    EthereumAuraAuraBalStakingContractPositionFetcher,
  ],
})
export class AuraAppModule extends AbstractApp() {}
