import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import AIRSWAP_DEFINITION, { AirswapAppDefinition } from './airswap.definition';
import { AirswapContractFactory } from './contracts';
import { EthereumAirswapBalanceFetcher } from './ethereum/airswap.balance-fetcher';
import { EthereumAirswapSAstTokenFetcher } from './ethereum/airswap.s-ast.token-fetcher';

@Register.AppModule({
  appId: AIRSWAP_DEFINITION.id,
  providers: [
    AirswapAppDefinition,
    AirswapContractFactory,
    EthereumAirswapBalanceFetcher,
    EthereumAirswapSAstTokenFetcher,
  ],
})
export class AirswapAppModule extends AbstractApp() {}
