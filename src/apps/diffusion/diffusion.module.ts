import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { DiffusionContractFactory } from './contracts';
import { DiffusionAppDefinition, DIFFUSION_DEFINITION } from './diffusion.definition';
import { EvmosDiffusionPoolTokenFetcher } from './evmos/diffusion.pool.token-fetcher';

@Register.AppModule({
  appId: DIFFUSION_DEFINITION.id,
  providers: [DiffusionAppDefinition, DiffusionContractFactory, EvmosDiffusionPoolTokenFetcher, UniswapV2AppModule],
  imports: [UniswapV2AppModule],
})
export class DiffusionAppModule extends AbstractApp() {}
