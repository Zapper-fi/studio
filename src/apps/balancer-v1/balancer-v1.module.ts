import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import BALANCER_V1_DEFINITION, { BalancerV1AppDefinition } from './balancer-v1.definition';
import { EthereumBalancerV1PoolTokenFetcher } from './ethereum/balancer-v1.pool.token-fetcher';

@Register.AppModule({
  appId: BALANCER_V1_DEFINITION.id,
  providers: [BalancerV1AppDefinition, EthereumBalancerV1PoolTokenFetcher],
})
export class BalancerV1AppModule extends AbstractApp() {}
