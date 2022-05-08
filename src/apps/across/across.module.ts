import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AcrossAppDefinition, ACROSS_DEFINITION } from './across.definition';

import { ArbitrumAcrossBalanceFetcher } from './arbitrum/across.balance-fetcher';
import { BobaAcrossBalanceFetcher } from './boba/across.balance-fetcher';
import { AcrossContractFactory } from './contracts';
import { EthereumAcrossBalanceFetcher } from './ethereum/across.balance-fetcher';
import { EthereumAcrossTvlFetcher } from './ethereum/eth.across.lp-fetcher';
import { PolygonAcrossBalanceFetcher } from './polygon/across.balance-fetcher';

@Register.AppModule({
  appId: ACROSS_DEFINITION.id,
  providers: [
    AcrossAppDefinition,
    AcrossContractFactory,
    EthereumAcrossBalanceFetcher,
    PolygonAcrossBalanceFetcher,
    ArbitrumAcrossBalanceFetcher,
    EthereumAcrossTvlFetcher,
    BobaAcrossBalanceFetcher,
  ],
})
export class AcrossAppModule extends AbstractApp() { }
