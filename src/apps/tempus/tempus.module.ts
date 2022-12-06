import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { TempusContractFactory } from './contracts';
import { EthereumTempusAmmTokenFetcher } from './ethereum/tempus.amm.token-fetcher';
import { EthereumTempusPoolTokenFetcher } from './ethereum/tempus.pool.token-fetcher';
import { FantomTempusAmmTokenFetcher } from './fantom/tempus.amm.token-fetcher';
import { FantomTempusPoolTokenFetcher } from './fantom/tempus.pool.token-fetcher';
import { TempusAppDefinition, TEMPUS_DEFINITION } from './tempus.definition';

@Register.AppModule({
  appId: TEMPUS_DEFINITION.id,
  providers: [
    TempusAppDefinition,
    TempusContractFactory,
    // Ethereum
    EthereumTempusAmmTokenFetcher,
    EthereumTempusPoolTokenFetcher,
    // Fantom
    FantomTempusAmmTokenFetcher,
    FantomTempusPoolTokenFetcher,
  ],
})
export class TempusAppModule extends AbstractApp() {}
