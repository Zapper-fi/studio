import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AuroraTrisolarisBalanceFetcher } from './aurora/trisolaris.balance-fetcher';
import { AuroraTrisolarisFarmContractPositionFetcher } from './aurora/trisolaris.farm.contract-position-fetcher';
import { AuroraTrisolarisPoolAddressCacheManager } from './aurora/trisolaris.pool.cache-manager';
import { AuroraTrisolarisPoolTokenFetcher } from './aurora/trisolaris.pool.token-fetcher';
import { TrisolarisContractFactory } from './contracts';
import { TrisolarisAppDefinition, TRISOLARIS_DEFINITION } from './trisolaris.definition';

@Register.AppModule({
  appId: TRISOLARIS_DEFINITION.id,
  providers: [
    AuroraTrisolarisBalanceFetcher,
    AuroraTrisolarisFarmContractPositionFetcher,
    AuroraTrisolarisPoolAddressCacheManager,
    AuroraTrisolarisPoolTokenFetcher,
    TrisolarisAppDefinition,
    TrisolarisContractFactory,
  ],
})
export class TrisolarisAppModule extends AbstractApp() {}
