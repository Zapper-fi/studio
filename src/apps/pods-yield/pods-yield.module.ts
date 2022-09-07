import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { PodsYieldContractFactory } from './contracts';
import { EthereumPodsYieldStrategyTokenFetcher } from './ethereum/pods-yield.strategy.token-fetcher';
import { PodsYieldAppDefinition, PODS_YIELD_DEFINITION } from './pods-yield.definition';

@Register.AppModule({
  appId: PODS_YIELD_DEFINITION.id,
  providers: [EthereumPodsYieldStrategyTokenFetcher, PodsYieldAppDefinition, PodsYieldContractFactory],
})
export class PodsYieldAppModule extends AbstractApp() {}
