import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { TetuContractFactory } from './contracts';
import { PolygonTetuPoolTokenFetcher } from './polygon/tetu.pool.token-fetcher';
import { TetuYieldTokenFetcher } from './polygon/tetu.yield.token-fetcher';
import TETU_DEFINITION, { TetuAppDefinition } from './tetu.definition';

@Register.AppModule({
  appId: TETU_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [TetuAppDefinition, TetuContractFactory, PolygonTetuPoolTokenFetcher, TetuYieldTokenFetcher],
})
export class TetuAppModule extends AbstractApp() {}
