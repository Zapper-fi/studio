import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { AvalancheHakuswapBalanceFetcher } from './avalanche/hakuswap.balance-fetcher';
import { AvalancheHakuswapFarmContractPositionFetcher } from './avalanche/hakuswap.farm.contract-position-fetcher';
import { AvalancheHakuswapPoolTokenFetcher } from './avalanche/hakuswap.pool.token-fetcher';
import { HakuswapContractFactory } from './contracts';
import { HakuswapAppDefinition, HAKUSWAP_DEFINITION } from './hakuswap.definition';

@Register.AppModule({
  appId: HAKUSWAP_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    AvalancheHakuswapBalanceFetcher,
    AvalancheHakuswapFarmContractPositionFetcher,
    AvalancheHakuswapPoolTokenFetcher,
    HakuswapAppDefinition,
    HakuswapContractFactory,
  ],
})
export class HakuswapAppModule extends AbstractApp() {}
