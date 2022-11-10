import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumKyberswapElasticLiquidityContractPositionFetcher } from './arbitrum/kyberswap-elastic.liquidity.contract-position-fetcher';
import { AvalancheKyberswapElasticLiquidityContractPositionFetcher } from './avalanche/kyberswap-elastic.liquidity.contract-position-fetcher';
import { BinanceSmartChainKyberswapElasticLiquidityContractPositionFetcher } from './binance-smart-chain/kyberswap-elastic.liquidity.contract-position-fetcher';
import { KyberswapElasticApyDataLoader } from './common/kyberswap-elastic.apy.data-loader';
import { KyberswapElasticFarmContractPositionBuilder } from './common/kyberswap-elastic.farm.contract-position-builder';
import { KyberswapElasticLiquidityContractPositionBuilder } from './common/kyberswap-elastic.liquidity.contract-position-builder';
import { KyberswapElasticContractFactory } from './contracts';
import { CronosKyberswapElasticLiquidityContractPositionFetcher } from './cronos/kyberswap-elastic.liquidity.contract-position-fetcher';
import { EthereumKyberswapElasticFarmContractPositionFetcher } from './ethereum/kyberswap-elastic.farm.contract-position-fetcher';
import { EthereumKyberswapElasticLiquidityContractPositionFetcher } from './ethereum/kyberswap-elastic.liquidity.contract-position-fetcher';
import { FantomKyberswapElasticLiquidityContractPositionFetcher } from './fantom/kyberswap-elastic.liquidity.contract-position-fetcher';
import KYBERSWAP_ELASTIC_DEFINITION, { KyberswapElasticAppDefinition } from './kyberswap-elastic.definition';
import { OptimismKyberswapElasticLiquidityContractPositionFetcher } from './optimism/kyberswap-elastic.liquidity.contract-position-fetcher';
import { PolygonKyberswapElasticLiquidityContractPositionFetcher } from './polygon/kyberswap-elastic.liquidity.contract-position-fetcher';

@Register.AppModule({
  appId: KYBERSWAP_ELASTIC_DEFINITION.id,
  providers: [
    KyberswapElasticAppDefinition,
    KyberswapElasticContractFactory,
    KyberswapElasticApyDataLoader,
    KyberswapElasticFarmContractPositionBuilder,
    KyberswapElasticLiquidityContractPositionBuilder,
    // Ethereum
    EthereumKyberswapElasticLiquidityContractPositionFetcher,
    EthereumKyberswapElasticFarmContractPositionFetcher,
    // Binance-smart-chain
    BinanceSmartChainKyberswapElasticLiquidityContractPositionFetcher,
    // Avalanche
    AvalancheKyberswapElasticLiquidityContractPositionFetcher,
    // Fantom
    FantomKyberswapElasticLiquidityContractPositionFetcher,
    // Optimism
    OptimismKyberswapElasticLiquidityContractPositionFetcher,
    // Cronos
    CronosKyberswapElasticLiquidityContractPositionFetcher,
    // Arbitrum
    ArbitrumKyberswapElasticLiquidityContractPositionFetcher,
    // Polygon
    PolygonKyberswapElasticLiquidityContractPositionFetcher,
  ],
})
export class KyberswapElasticAppModule extends AbstractApp() {}
