import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumImpermaxBalanceFetcher } from './arbitrum/impermax.balance-fetcher';
import { ArbitrumImpermaxLendTokenFetcher } from './arbitrum/impermax.lend.token-fetcher';
import { ImpermaxContractFactory } from './contracts';
import { EthereumImpermaxBalanceFetcher } from './ethereum/impermax.balance-fetcher';
import { EthereumImpermaxLendTokenFetcher } from './ethereum/impermax.lend.token-fetcher';
import { ImpermaxAppDefinition, IMPERMAX_DEFINITION } from './impermax.definition';
import { PolygonImpermaxBalanceFetcher } from './polygon/impermax.balance-fetcher';
import { PolygonImpermaxLendTokenFetcher } from './polygon/impermax.lend.token-fetcher';

@Register.AppModule({
  appId: IMPERMAX_DEFINITION.id,
  providers: [
    ArbitrumImpermaxBalanceFetcher,
    ArbitrumImpermaxLendTokenFetcher,
    EthereumImpermaxBalanceFetcher,
    EthereumImpermaxLendTokenFetcher,
    ImpermaxAppDefinition,
    ImpermaxContractFactory,
    PolygonImpermaxBalanceFetcher,
    PolygonImpermaxLendTokenFetcher,
  ],
})
export class ImpermaxAppModule extends AbstractApp() {}
