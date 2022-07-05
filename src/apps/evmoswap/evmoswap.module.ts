import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { EvmoswapContractFactory } from './contracts';
import { EvmosEvmoswapFarmContractPositionFetcher } from './evmos/evmoswap.farm.contract-position-fetcher';
import { EvmosEvmoswapPoolTokenFetcher } from './evmos/evmoswap.pool.token-fetcher';
import { EvmoswapAppDefinition, EVMOSWAP_DEFINITION } from './evmoswap.definition';

@Register.AppModule({
  appId: EVMOSWAP_DEFINITION.id,
  providers: [
    EvmosEvmoswapFarmContractPositionFetcher,
    EvmosEvmoswapPoolTokenFetcher,
    EvmoswapAppDefinition,
    EvmoswapContractFactory,
    UniswapV2AppModule,
  ],
  imports: [UniswapV2AppModule],
})
export class EvmoswapAppModule extends AbstractApp() {}
