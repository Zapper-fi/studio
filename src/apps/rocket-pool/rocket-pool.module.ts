import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { RocketPoolContractFactory } from './contracts';
import { EthereumRocketPoolBalanceFetcher } from './ethereum/rocket-pool.balance-fetcher';
import { EthereumRocketPoolOracleDaoBondContractPositionFetcher } from './ethereum/rocket-pool.oracle-dao-bond.contract-position-fetcher';
import { EthereumRocketPoolStakingContractPositionFetcher } from './ethereum/rocket-pool.staking.contract-position-fetcher';
import { RocketPoolAppDefinition, ROCKET_POOL_DEFINITION } from './rocket-pool.definition';

@Register.AppModule({
  appId: ROCKET_POOL_DEFINITION.id,
  providers: [
    RocketPoolAppDefinition,
    RocketPoolContractFactory,
    EthereumRocketPoolBalanceFetcher,
    EthereumRocketPoolOracleDaoBondContractPositionFetcher,
    EthereumRocketPoolStakingContractPositionFetcher,
  ],
})
export class RocketPoolAppModule extends AbstractApp() {}
