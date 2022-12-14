import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheHakuswapFarmContractPositionFetcher } from './avalanche/hakuswap.farm.contract-position-fetcher';
import { AvalancheHakuswapPoolTokenFetcher } from './avalanche/hakuswap.pool.token-fetcher';
import { HakuswapContractFactory } from './contracts';
import { HakuswapAppDefinition, HAKUSWAP_DEFINITION } from './hakuswap.definition';

@Register.AppModule({
  appId: HAKUSWAP_DEFINITION.id,
  providers: [
    HakuswapAppDefinition,
    HakuswapContractFactory,
    AvalancheHakuswapFarmContractPositionFetcher,
    AvalancheHakuswapPoolTokenFetcher,
  ],
})
export class HakuswapAppModule extends AbstractApp() {}
