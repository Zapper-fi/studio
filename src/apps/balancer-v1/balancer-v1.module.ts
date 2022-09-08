import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import BALANCER_V1_DEFINITION, { BalancerV1AppDefinition } from './balancer-v1.definition';
import { BalancerV1ContractFactory } from './contracts';
import { EthereumBalancerV1PoolTokenFetcher } from './ethereum/balancer-v1.pool.token-fetcher';
import { EthereumBalancerV1PoolSubgraphVolumeDataLoader } from './ethereum/balancer-v1.volume.data-loader';

@Register.AppModule({
  appId: BALANCER_V1_DEFINITION.id,
  providers: [
    BalancerV1AppDefinition,
    BalancerV1ContractFactory,
    EthereumBalancerV1PoolTokenFetcher,
    EthereumBalancerV1PoolSubgraphVolumeDataLoader,
  ],
})
export class BalancerV1AppModule extends AbstractApp() {}
