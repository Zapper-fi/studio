import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumMyceliumBalanceFetcher } from './arbitrum/mycelium.balance-fetcher';
import { ArbitrumMyceliumEsMycTokenFetcher } from './arbitrum/mycelium.es-myc.token-fetcher';
import { ArbitrumMyceliumLevTradesContractPositionFetcher } from './arbitrum/mycelium.lev-trades.contract-position-fetcher';
import { ArbitrumMyceliumMlpTokenFetcher } from './arbitrum/mycelium.mlp.token-fetcher';
import { ArbitrumMyceliumPerpTokensFetcher } from './arbitrum/mycelium.perp-tokens.token-fetcher';
import { MyceliumContractFactory } from './contracts';
import { MyceliumApiHelper } from './helpers/mycelium.api.helper';
import { MyceliumEsMycTokenHelper } from './helpers/mycelium.es-myc.token-helper';
import { MyceliumLevTradesBalanceHelper } from './helpers/mycelium.lev-trades.balance-helper';
import { MyceliumLevTradesContractPositionHelper } from './helpers/mycelium.lev-trades.contract-position-helper';
import { MyceliumMlpTokenHelper } from './helpers/mycelium.mlp.token-helper';
import { MyceliumPerpTokensHelper } from './helpers/mycelium.perp-tokens.token-helper';
import { MyceliumAppDefinition, MYCELIUM_DEFINITION } from './mycelium.definition';

@Register.AppModule({
  appId: MYCELIUM_DEFINITION.id,
  providers: [
    ArbitrumMyceliumBalanceFetcher,
    ArbitrumMyceliumEsMycTokenFetcher,
    ArbitrumMyceliumLevTradesContractPositionFetcher,
    ArbitrumMyceliumMlpTokenFetcher,
    ArbitrumMyceliumPerpTokensFetcher,
    MyceliumApiHelper,
    MyceliumAppDefinition,
    MyceliumContractFactory,
    MyceliumEsMycTokenHelper,
    MyceliumLevTradesBalanceHelper,
    MyceliumLevTradesContractPositionHelper,
    MyceliumMlpTokenHelper,
    MyceliumPerpTokensHelper,
  ],
})
export class MyceliumAppModule extends AbstractApp() {}
