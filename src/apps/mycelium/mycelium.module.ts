import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumMyceliumEsMycTokenFetcher } from './arbitrum/mycelium.es-myc.token-fetcher';
import { ArbitrumMyceliumMlpTokenFetcher } from './arbitrum/mycelium.mlp.token-fetcher';
import { ArbitrumMycellilumPerpContractPositionFetcher } from './arbitrum/mycelium.perp.contract-position-fetcher';
import { MyceliumContractFactory } from './contracts';
import MYCELIUM_DEFINITION, { MyceliumAppDefinition } from './mycelium.definition';

@Register.AppModule({
  appId: MYCELIUM_DEFINITION.id,
  providers: [
    MyceliumAppDefinition,
    MyceliumContractFactory,
    // Arbitrum
    ArbitrumMyceliumEsMycTokenFetcher,
    ArbitrumMyceliumMlpTokenFetcher,
    ArbitrumMycellilumPerpContractPositionFetcher,
  ],
})
export class MyceliumAppModule extends AbstractApp() {}
