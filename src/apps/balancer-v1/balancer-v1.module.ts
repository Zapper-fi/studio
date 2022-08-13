import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import BALANCER_V1_DEFINITION, { BalancerV1AppDefinition } from './balancer-v1.definition';
import { EthereumBalancerV1BalanceFetcher } from './ethereum/balancer-v1.balance-fetcher';
import { EthereumBalancerV1PoolTokenFetcher } from './ethereum/balancer-v1.pool.token-fetcher';

@Register.AppModule({
  appId: BALANCER_V1_DEFINITION.id,
  providers: [BalancerV1AppDefinition, EthereumBalancerV1PoolTokenFetcher, EthereumBalancerV1BalanceFetcher],
})
export class BalancerV1AppModule extends AbstractApp() {}
