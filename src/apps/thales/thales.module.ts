import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ThalesContractFactory } from './contracts';
import { EthereumThalesBalanceFetcher } from './ethereum/thales.balance-fetcher';
import { EthereumThalesMarketContractPositionFetcher } from './ethereum/thales.market.contract-position-fetcher';
import { OptimismThalesBalanceFetcher } from './optimism/thales.balance-fetcher';
import { OptimismThalesMarketContractPositionFetcher } from './optimism/thales.market.contract-position-fetcher';
import { OptimismThalesTvlFetcher } from './optimism/thales.tvl-fetcher';
import { PolygonThalesBalanceFetcher } from './polygon/thales.balance-fetcher';
import { PolygonThalesMarketContractPositionFetcher } from './polygon/thales.market.contract-position-fetcher';
import { ThalesAppDefinition, THALES_DEFINITION } from './thales.definition';

@Register.AppModule({
  appId: THALES_DEFINITION.id,
  providers: [
    ThalesAppDefinition,
    ThalesContractFactory,
    EthereumThalesBalanceFetcher,
    EthereumThalesMarketContractPositionFetcher,
    PolygonThalesBalanceFetcher,
    PolygonThalesMarketContractPositionFetcher,
    OptimismThalesBalanceFetcher,
    OptimismThalesMarketContractPositionFetcher,
    OptimismThalesTvlFetcher,
  ],
})
export class ThalesAppModule extends AbstractApp() { }
