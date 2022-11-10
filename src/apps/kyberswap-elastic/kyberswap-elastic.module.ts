import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumKyberSwapElasticLiquidityContractPositionFetcher } from './arbitrum/kyberswap-elastic.liquidity.contract-position-fetcher';
import { AvalancheKyberSwapElasticLiquidityContractPositionFetcher } from './avalanche/kyberswap-elastic.liquidity.contract-position-fetcher';
import { BinanceSmartChainKyberSwapElasticLiquidityContractPositionFetcher } from './binance-smart-chain/kyberswap-elastic.liquidity.contract-position-fetcher';
import { KyberSwapElasticApyDataLoader } from './common/kyberswap-elastic.apy.data-loader';
import { KyberSwapElasticLiquidityContractPositionBuilder } from './common/kyberswap-elastic.liquidity.contract-position-builder';
import { KyberswapElasticContractFactory } from './contracts';
import { CronosKyberSwapElasticLiquidityContractPositionFetcher } from './cronos/kyberswap-elastic.liquidity.contract-position-fetcher';
import { EthereumKyberswapElasticFarmContractPositionFetcher } from './ethereum/kyberswap-elastic.farm.contract-position-fetcher';
import { EthereumKyberSwapElasticLiquidityContractPositionFetcher } from './ethereum/kyberswap-elastic.liquidity.contract-position-fetcher';
import { FantomKyberSwapElasticLiquidityContractPositionFetcher } from './fantom/kyberswap-elastic.liquidity.contract-position-fetcher';
import KYBERSWAP_ELASTIC_DEFINITION from './kyberswap-elastic.definition';
import { KyberSwapElasticAppDefinition } from './kyberswap-elastic.definition';
import { OptimismKyberSwapElasticLiquidityContractPositionFetcher } from './optimism/kyberswap-elastic.liquidity.contract-position-fetcher';
import { PolygonKyberSwapElasticLiquidityContractPositionFetcher } from './polygon/kyberswap-elastic.liquidity.contract-position-fetcher';

@Register.AppModule({
  appId: KYBERSWAP_ELASTIC_DEFINITION.id,
  providers: [
    ArbitrumKyberSwapElasticLiquidityContractPositionFetcher,
    AvalancheKyberSwapElasticLiquidityContractPositionFetcher,
    BinanceSmartChainKyberSwapElasticLiquidityContractPositionFetcher,
    CronosKyberSwapElasticLiquidityContractPositionFetcher,
    EthereumKyberswapElasticFarmContractPositionFetcher,
    EthereumKyberSwapElasticLiquidityContractPositionFetcher,
    EthereumKyberswapElasticFarmContractPositionFetcher,
    FantomKyberSwapElasticLiquidityContractPositionFetcher,
    KyberSwapElasticAppDefinition,
    KyberSwapElasticApyDataLoader,
    KyberSwapElasticLiquidityContractPositionBuilder,
    KyberswapElasticContractFactory,
    OptimismKyberSwapElasticLiquidityContractPositionFetcher,
    PolygonKyberSwapElasticLiquidityContractPositionFetcher,
  ],
})
export class KyberSwapElasticAppModule extends AbstractApp() {}
