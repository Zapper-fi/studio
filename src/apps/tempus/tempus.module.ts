import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CurvePoolTokenHelper } from '~apps/curve';

import { TempusContractFactory } from './contracts';
import { EthereumTempusAmmTokenFetcher } from './ethereum/tempus.amm.token-fetcher';
import { EthereumTempusBalanceFetcher } from './ethereum/tempus.balance-fetcher';
import { EthereumTempusTokensTokenFetcher } from './ethereum/tempus.pool.token-fetcher';
import { FantomTempusAmmTokenFetcher } from './fantom/tempus.amm.token-fetcher';
import { FantomTempusBalanceFetcher } from './fantom/tempus.balance-fetcher';
import { FantomTempusTokensTokenFetcher } from './fantom/tempus.pool.token-fetcher';
import { TempusAmmTokenFetcher } from './helpers/tempus.amm.token-helper';
import { TempusTokensTokenFetcher } from './helpers/tempus.pool.token-helper';
import { TempusAppDefinition, TEMPUS_DEFINITION } from './tempus.definition';

@Register.AppModule({
  appId: TEMPUS_DEFINITION.id,
  providers: [
    CurvePoolTokenHelper,
    TempusTokensTokenFetcher,
    TempusAmmTokenFetcher,
    EthereumTempusAmmTokenFetcher,
    EthereumTempusBalanceFetcher,
    EthereumTempusTokensTokenFetcher,
    FantomTempusAmmTokenFetcher,
    FantomTempusBalanceFetcher,
    FantomTempusTokensTokenFetcher,
    TempusAppDefinition,
    TempusContractFactory,
  ],
})
export class TempusAppModule extends AbstractApp() {}
