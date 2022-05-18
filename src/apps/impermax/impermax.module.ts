import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumImpermaxLendTokenFetcher } from './arbitrum/impermax.lend.token-fetcher';
import { ImpermaxContractFactory } from './contracts';
import { EthereumImpermaxLendTokenFetcher } from './ethereum/impermax.lend.token-fetcher';
import { ImpermaxAppDefinition, IMPERMAX_DEFINITION } from './impermax.definition';
import { PolygonImpermaxLendTokenFetcher } from './polygon/impermax.lend.token-fetcher';

@Register.AppModule({
  appId: IMPERMAX_DEFINITION.id,
  providers: [
    ArbitrumImpermaxLendTokenFetcher,
    EthereumImpermaxLendTokenFetcher,
    ImpermaxAppDefinition,
    ImpermaxContractFactory,
    PolygonImpermaxLendTokenFetcher,
  ],
})
export class ImpermaxAppModule extends AbstractApp() {}
