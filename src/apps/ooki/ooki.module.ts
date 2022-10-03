import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumOokiLendTokenFetcher } from './arbitrum/ooki.lend.token-fetcher';
import { BinanceSmartChainOokiLendTokenFetcher } from './binance-smart-chain/ooki.lend.token-fetcher';
import { OokiContractFactory } from './contracts';
import { EthereumOokiLendTokenFetcher } from './ethereum/ooki.lend.token-fetcher';
import { OOKI_DEFINITION, OokiAppDefinition } from './ooki.definition';
import { OptimismOokiLendTokenFetcher } from './optimism/ooki.lend.token-fetcher';
import { PolygonOokiLendTokenFetcher } from './polygon/ooki.lend.token-fetcher';

@Register.AppModule({
  appId: OOKI_DEFINITION.id,
  providers: [
    ArbitrumOokiLendTokenFetcher,
    BinanceSmartChainOokiLendTokenFetcher,
    EthereumOokiLendTokenFetcher,
    OptimismOokiLendTokenFetcher,
    PolygonOokiLendTokenFetcher,
    OokiAppDefinition,
    OokiContractFactory,
  ],
})
export class OokiAppModule extends AbstractApp() {}
