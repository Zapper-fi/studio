import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2';

import { OptimismZipSwapPoolTokenFetcher } from './optimism/zip-swap.pool.token-fetcher';
import { ZipSwapAppDefinition, ZIP_SWAP_DEFINITION } from './zip-swap.definition';

@Register.AppModule({
  appId: ZIP_SWAP_DEFINITION.id,
  providers: [UniswapV2ContractFactory, ZipSwapAppDefinition, OptimismZipSwapPoolTokenFetcher],
})
export class ZipSwapAppModule extends AbstractApp() {}
