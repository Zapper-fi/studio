import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { AuraBaseRewardPoolHelper } from '~apps/aura/helpers/aura.base-reward-pool-helper';
import { AuraBalancerPoolsHelper } from '~apps/aura/helpers/aura-balancer-pools-helper.service';
import { BalancerV2AppModule } from '~apps/balancer-v2';
import { SynthetixAppModule } from '~apps/synthetix';

import { AuraAppDefinition, AURA_DEFINITION } from './aura.definition';
import { AuraContractFactory } from './contracts';
import { EthereumAuraBalanceFetcher } from './ethereum/aura.balance-fetcher';
import { EthereumAuraChefContractPositionFetcher } from './ethereum/aura.chef.contract-position-fetcher';
import { EthereumAuraChefTokenFetcher } from './ethereum/aura.chef.token-fetcher';
import { EthereumAuraLockerContractPositionFetcher } from './ethereum/aura.locker.contract-position-fetcher';
import { EthereumAuraPoolsContractPositionFetcher } from './ethereum/aura.pools.contract-position-fetcher';
import { EthereumAuraPoolsTokenFetcher } from './ethereum/aura.pools.token-fetcher';
import { EthereumAuraStakingContractPositionFetcher } from './ethereum/aura.staking.contract-position-fetcher';

@Register.AppModule({
  appId: AURA_DEFINITION.id,
  imports: [SynthetixAppModule, BalancerV2AppModule],
  providers: [
    AuraAppDefinition,
    AuraContractFactory,
    AuraBalancerPoolsHelper,
    AuraBaseRewardPoolHelper,
    EthereumAuraChefTokenFetcher,
    EthereumAuraChefContractPositionFetcher,
    EthereumAuraLockerContractPositionFetcher,
    EthereumAuraStakingContractPositionFetcher,
    EthereumAuraPoolsTokenFetcher,
    EthereumAuraPoolsContractPositionFetcher,
    EthereumAuraBalanceFetcher,
  ],
})
export class AuraAppModule extends AbstractApp() {}
