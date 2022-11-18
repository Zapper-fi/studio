import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheInsuraceBalanceFetcher } from './avalanche/insurace.balance-fetcher';
import { AvalancheInsuraceMiningTokenFetcher } from './avalanche/insurace.mining.token-fetcher';
import { BinanceSmartChainInsuraceBalanceFetcher } from './binance-smart-chain/insurace.balance-fetcher';
import { BinanceSmartChainInsuraceMiningTokenFetcher } from './binance-smart-chain/insurace.mining.token-fetcher';
import { InsuraceContractFactory } from './contracts';
import { EthereumInsuraceBalanceFetcher } from './ethereum/insurace.balance-fetcher';
import { EthereumInsuraceMiningTokenFetcher } from './ethereum/insurace.mining.token-fetcher';
import { InsuraceAppDefinition, INSURACE_DEFINITION } from './insurace.definition';
import { PolygonInsuraceBalanceFetcher } from './polygon/insurace.balance-fetcher';
import { PolygonInsuraceMiningTokenFetcher } from './polygon/insurace.mining.token-fetcher';

@Register.AppModule({
  appId: INSURACE_DEFINITION.id,
  providers: [
    AvalancheInsuraceBalanceFetcher,
    AvalancheInsuraceMiningTokenFetcher,
    BinanceSmartChainInsuraceBalanceFetcher,
    BinanceSmartChainInsuraceMiningTokenFetcher,
    EthereumInsuraceBalanceFetcher,
    EthereumInsuraceMiningTokenFetcher,
    InsuraceAppDefinition,
    InsuraceContractFactory,
    PolygonInsuraceBalanceFetcher,
    PolygonInsuraceMiningTokenFetcher,
  ],
})
export class InsuraceAppModule extends AbstractApp() {}
