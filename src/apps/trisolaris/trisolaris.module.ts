import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2';

import { AuroraTrisolarisFarmContractPositionFetcher } from './aurora/trisolaris.farm.contract-position-fetcher';
import { AuroraTrisolarisPoolTokenFetcher } from './aurora/trisolaris.pool.token-fetcher';
import { TrisolarisContractFactory } from './contracts';
import { TrisolarisAppDefinition, TRISOLARIS_DEFINITION } from './trisolaris.definition';

@Register.AppModule({
  appId: TRISOLARIS_DEFINITION.id,
  providers: [
    TrisolarisAppDefinition,
    TrisolarisContractFactory,
    UniswapV2ContractFactory,
    AuroraTrisolarisFarmContractPositionFetcher,
    AuroraTrisolarisPoolTokenFetcher,
  ],
})
export class TrisolarisAppModule extends AbstractApp() {}
