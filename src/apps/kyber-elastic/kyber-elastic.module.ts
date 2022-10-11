import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheKyberElasticLiquidityContractPositionFetcher } from './avalanche/kyber-elastic.liquidity.contract-position-fetcher';
import { BinanceSmartChainKyberElasticLiquidityContractPositionFetcher } from './binance-smart-chain/kyber-elastic.liquidity.contract-position-fetcher';
import { KyberElasticLiquidityContractPositionBuilder } from './common/kyber-elastic.liquidity.contract-position-builder';
import { KyberElasticContractFactory } from './contracts';
import { EthereumKyberElasticLiquidityContractPositionFetcher } from './ethereum/kyber-elastic.liquidity.contract-position-fetcher';
import KYBER_ELASTIC_DEFINITION from './kyber-elastic.definition';
import { KyberElasticAppDefinition } from './kyber-elastic.definition';

@Register.AppModule({
  appId: KYBER_ELASTIC_DEFINITION.id,
  providers: [
    KyberElasticAppDefinition,
    KyberElasticContractFactory,
    KyberElasticLiquidityContractPositionBuilder,
    EthereumKyberElasticLiquidityContractPositionFetcher,
    BinanceSmartChainKyberElasticLiquidityContractPositionFetcher,
    AvalancheKyberElasticLiquidityContractPositionFetcher,
  ],
  exports: [KyberElasticContractFactory],
})
export class KyberElasticAppModule extends AbstractApp() {}
