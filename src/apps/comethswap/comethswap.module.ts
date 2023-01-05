import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2';

import { COMETHSWAP_DEFINITION, ComethswapAppDefinition } from './comethswap.definition';
import { PolygonComethswapPoolTokenFetcher } from './polygon/comethswap.pool.token-fetcher';

@Register.AppModule({
  appId: COMETHSWAP_DEFINITION.id,
  providers: [ComethswapAppDefinition, UniswapV2ContractFactory, PolygonComethswapPoolTokenFetcher],
})
export class ComethswapAppModule extends AbstractApp() {}
