import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheInsuraceMiningTokenFetcher } from './avalanche/insurace.mining.token-fetcher';
import { BinanceSmartChainInsuraceMiningTokenFetcher } from './binance-smart-chain/insurace.mining.token-fetcher';
import { InsuraceContractFactory } from './contracts';
import { EthereumInsuraceMiningTokenFetcher } from './ethereum/insurace.mining.token-fetcher';
import { InsuraceAppDefinition, INSURACE_DEFINITION } from './insurace.definition';
import { PolygonInsuraceMiningTokenFetcher } from './polygon/insurace.mining.token-fetcher';

@Register.AppModule({
  appId: INSURACE_DEFINITION.id,
  providers: [
    InsuraceAppDefinition,
    InsuraceContractFactory,
    // Avalanche
    AvalancheInsuraceMiningTokenFetcher,
    // Binance-smart-chain
    BinanceSmartChainInsuraceMiningTokenFetcher,
    // Ethereum
    EthereumInsuraceMiningTokenFetcher,
    // Polygon
    PolygonInsuraceMiningTokenFetcher,
  ],
})
export class InsuraceAppModule extends AbstractApp() {}
