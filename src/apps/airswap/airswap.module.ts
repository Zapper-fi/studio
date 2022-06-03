import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import AIRSWAP_DEFINITION, { AirswapAppDefinition } from './airswap.definition';
import { AirswapContractFactory } from './contracts';
import { EthereumAirswapSAstV2TokenFetcher } from './ethereum/airswap.s-ast-v2.token-fetcher';
import { EthereumAirswapSAstV3TokenFetcher } from './ethereum/airswap.s-ast-v3.token-fetcher';

@Register.AppModule({
  appId: AIRSWAP_DEFINITION.id,
  providers: [
    AirswapAppDefinition,
    AirswapContractFactory,
    EthereumAirswapSAstV2TokenFetcher,
    EthereumAirswapSAstV3TokenFetcher,
  ],
})
export class AirswapAppModule extends AbstractApp() {}
