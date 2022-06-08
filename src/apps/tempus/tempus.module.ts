import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { TempusContractFactory } from './contracts';
import { EthereumTempusBalanceFetcher } from './ethereum/tempus.balance-fetcher';
import { EthereumTempusTokensTokenFetcher } from './ethereum/tempus.tokens.token-fetcher';
import { FantomTempusBalanceFetcher } from './fantom/tempus.balance-fetcher';
import { FantomTempusTokensTokenFetcher } from './fantom/tempus.tokens.token-fetcher';
import { TempusAppDefinition, TEMPUS_DEFINITION } from './tempus.definition';

@Register.AppModule({
  appId: TEMPUS_DEFINITION.id,
  providers: [
    EthereumTempusBalanceFetcher,
    EthereumTempusTokensTokenFetcher,
    FantomTempusBalanceFetcher,
    FantomTempusTokensTokenFetcher,
    TempusAppDefinition,
    TempusContractFactory,
  ],
})
export class TempusAppModule extends AbstractApp() { }
