import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumKyberElasticLiquidityContractPositionFetcher } from './arbitrum/kyber-elastic.liquidity.contract-position-fetcher';
import { AvalancheKyberElasticLiquidityContractPositionFetcher } from './avalanche/kyber-elastic.liquidity.contract-position-fetcher';
import { BinanceSmartChainKyberElasticLiquidityContractPositionFetcher } from './binance-smart-chain/kyber-elastic.liquidity.contract-position-fetcher';
import { KyberElasticLiquidityContractPositionBuilder } from './common/kyber-elastic.liquidity.contract-position-builder';
import { KyberElasticContractFactory } from './contracts';
import { CronosKyberElasticLiquidityContractPositionFetcher } from './cronos/kyber-elastic.liquidity.contract-position-fetcher';
import { EthereumKyberElasticLiquidityContractPositionFetcher } from './ethereum/kyber-elastic.liquidity.contract-position-fetcher';
import { FantomKyberElasticLiquidityContractPositionFetcher } from './fantom/kyber-elastic.liquidity.contract-position-fetcher';
import KYBER_ELASTIC_DEFINITION from './kyber-elastic.definition';
import { KyberElasticAppDefinition } from './kyber-elastic.definition';
import { OptimismKyberElasticLiquidityContractPositionFetcher } from './optimism/kyber-elastic.liquidity.contract-position-fetcher';
import { PolygonKyberElasticLiquidityContractPositionFetcher } from './polygon/kyber-elastic.liquidity.contract-position-fetcher';

@Register.AppModule({
  appId: KYBER_ELASTIC_DEFINITION.id,
  providers: [
    KyberElasticAppDefinition,
    KyberElasticContractFactory,
    KyberElasticLiquidityContractPositionBuilder,
    EthereumKyberElasticLiquidityContractPositionFetcher,
    BinanceSmartChainKyberElasticLiquidityContractPositionFetcher,
    AvalancheKyberElasticLiquidityContractPositionFetcher,
    FantomKyberElasticLiquidityContractPositionFetcher,
    OptimismKyberElasticLiquidityContractPositionFetcher,
    CronosKyberElasticLiquidityContractPositionFetcher,
    ArbitrumKyberElasticLiquidityContractPositionFetcher,
    PolygonKyberElasticLiquidityContractPositionFetcher,
  ],
  exports: [KyberElasticContractFactory],
})
export class KyberElasticAppModule extends AbstractApp() {}
