import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { PodsYieldContractFactory } from './contracts';
import { EthereumPodsYieldBalanceFetcher } from './ethereum/pods-yield.balance-fetcher';
import { EthereumPodsYieldQueueContractPositionFetcher } from './ethereum/pods-yield.queue.contract-position-fetcher';
import { EthereumPodsYieldStrategyTokenFetcher } from './ethereum/pods-yield.strategy.token-fetcher';
import { PodsYieldAppDefinition, PODS_YIELD_DEFINITION } from './pods-yield.definition';

@Register.AppModule({
  appId: PODS_YIELD_DEFINITION.id,
  providers: [
    EthereumPodsYieldBalanceFetcher,
    EthereumPodsYieldQueueContractPositionFetcher,
    EthereumPodsYieldStrategyTokenFetcher,
    PodsYieldAppDefinition,
    PodsYieldContractFactory,
  ],
})
export class PodsYieldAppModule extends AbstractApp() {}
