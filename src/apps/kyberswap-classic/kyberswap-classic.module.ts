import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2';

import { ArbitrumKyberSwapClassicPoolTokenFetcher } from './arbitrum/kyberswap-classic.pool.token-fetcher';
import { AvalancheKyberSwapClassicFarmContractPositionFetcher } from './avalanche/kyberswap-classic.farm.contract-position-fetcher';
import { AvalancheKyberSwapClassicPoolTokenFetcher } from './avalanche/kyberswap-classic.pool.token-fetcher';
import { BinanceSmartChainKyberSwapClassicFarmContractPositionFetcher } from './binance-smart-chain/kyberswap-classic.farm.contract-position-fetcher';
import { BinanceSmartChainKyberSwapClassicPoolTokenFetcher } from './binance-smart-chain/kyberswap-classic.pool.token-fetcher';
import { KyberswapClassicContractFactory } from './contracts';
import { CronosKyberSwapClassicPoolTokenFetcher } from './cronos/kyberswap-classic.pool.token-fetcher';
import { EthereumKyberSwapClassicFarmContractPositionFetcher } from './ethereum/kyberswap-classic.farm.contract-position-fetcher';
import { EthereumKyberSwapClassicPoolTokenFetcher } from './ethereum/kyberswap-classic.pool.token-fetcher';
import { FantomKyberSwapClassicPoolTokenFetcher } from './fantom/kyberswap-classic.pool.token-fetcher';
import { KyberSwapClassicAppDefinition, KYBERSWAP_CLASSIC_DEFINITION } from './kyberswap-classic.definition';
import { OptimismKyberSwapClassicPoolTokenFetcher } from './optimism/kyberswap-classic.pool.token-fetcher';
import { PolygonKyberSwapClassicFarmContractPositionFetcher } from './polygon/kyberswap-classic.farm.contract-position-fetcher';
import { PolygonKyberSwapClassicLegacyFarmContractPositionFetcher } from './polygon/kyberswap-classic.legacy-farm.contract-position-fetcher';
import { PolygonKyberSwapClassicPoolTokenFetcher } from './polygon/kyberswap-classic.pool.token-fetcher';

@Register.AppModule({
  appId: KYBERSWAP_CLASSIC_DEFINITION.id,
  providers: [
    KyberSwapClassicAppDefinition,
    KyberswapClassicContractFactory,
    UniswapV2ContractFactory,
    EthereumKyberSwapClassicPoolTokenFetcher,
    EthereumKyberSwapClassicFarmContractPositionFetcher,
    PolygonKyberSwapClassicPoolTokenFetcher,
    PolygonKyberSwapClassicFarmContractPositionFetcher,
    PolygonKyberSwapClassicLegacyFarmContractPositionFetcher,
    AvalancheKyberSwapClassicPoolTokenFetcher,
    AvalancheKyberSwapClassicFarmContractPositionFetcher,
    CronosKyberSwapClassicPoolTokenFetcher,
    FantomKyberSwapClassicPoolTokenFetcher,
    ArbitrumKyberSwapClassicPoolTokenFetcher,
    BinanceSmartChainKyberSwapClassicFarmContractPositionFetcher,
    BinanceSmartChainKyberSwapClassicPoolTokenFetcher,
    OptimismKyberSwapClassicPoolTokenFetcher,
  ],
})
export class KyberSwapClassicAppModule extends AbstractApp() {}
