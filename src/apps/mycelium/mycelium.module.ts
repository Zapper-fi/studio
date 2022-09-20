import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumMyceliumBalanceFetcher } from './arbitrum/mycelium.balance-fetcher';
import { ArbitrumMyceliumEsMycTokenFetcher } from './arbitrum/mycelium.es-myc.token-fetcher';
import { ArbitrumMyceliumLevTradesContractPositionFetcher } from './arbitrum/mycelium.lev-trades.contract-position-fetcher';
import { ArbitrumMyceliumMlpTokenFetcher } from './arbitrum/mycelium.mlp.token-fetcher';
import { MyceliumContractFactory } from './contracts';
import { MyceliumEsMycTokenHelper } from './helpers/mycelium.es-myc.token-helper';
import { MyceliumLevTradesBalanceHelper } from './helpers/mycelium.lev-trades.balance-helper';
import { MyceliumLevTradesContractPositionHelper } from './helpers/mycelium.lev-trades.contract-position-helper';
import { MyceliumMlpTokenHelper } from './helpers/mycelium.mlp.token-helper';
import { MyceliumAppDefinition, MYCELIUM_DEFINITION } from './mycelium.definition';

@Register.AppModule({
  appId: MYCELIUM_DEFINITION.id,
  providers: [
    MyceliumAppDefinition,
    MyceliumContractFactory,
    // Getchers
    ArbitrumMyceliumBalanceFetcher,
    ArbitrumMyceliumEsMycTokenFetcher,
    ArbitrumMyceliumMlpTokenFetcher,
    ArbitrumMyceliumLevTradesContractPositionFetcher,
    // Helpers
    MyceliumEsMycTokenHelper,
    MyceliumMlpTokenHelper,
    MyceliumLevTradesBalanceHelper,
    MyceliumLevTradesContractPositionHelper,
  ],
})
export class MyceliumAppModule extends AbstractApp() {}
