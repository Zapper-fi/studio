import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { AuroraTrisolarisBalanceFetcher } from './aurora/trisolaris.balance-fetcher';
import { AuroraTrisolarisFarmContractPositionFetcher } from './aurora/trisolaris.farm.contract-position-fetcher';
import { AuroraTrisolarisPoolAddressCacheManager } from './aurora/trisolaris.pool.cache-manager';
import { AuroraTrisolarisPoolTokenFetcher } from './aurora/trisolaris.pool.token-fetcher';
import { TrisolarisContractFactory } from './contracts';
import { TrisolarisAppDefinition, TRISOLARIS_DEFINITION } from './trisolaris.definition';

@Register.AppModule({
  appId: TRISOLARIS_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    TrisolarisAppDefinition,
    TrisolarisContractFactory,
    AuroraTrisolarisBalanceFetcher,
    AuroraTrisolarisFarmContractPositionFetcher,
    AuroraTrisolarisPoolAddressCacheManager,
    AuroraTrisolarisPoolTokenFetcher,
  ],
})
export class TrisolarisAppModule extends AbstractApp() {}
