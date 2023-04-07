import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2/contracts';

import { ArbitrumKyberSwapClassicPoolTokenFetcher } from './arbitrum/kyberswap-classic.pool.token-fetcher';
import { AvalancheKyberSwapClassicFarmContractPositionFetcher } from './avalanche/kyberswap-classic.farm.contract-position-fetcher';
import { AvalancheKyberSwapClassicPoolTokenFetcher } from './avalanche/kyberswap-classic.pool.token-fetcher';
import { BinanceSmartChainKyberSwapClassicFarmContractPositionFetcher } from './binance-smart-chain/kyberswap-classic.farm.contract-position-fetcher';
import { BinanceSmartChainKyberSwapClassicPoolTokenFetcher } from './binance-smart-chain/kyberswap-classic.pool.token-fetcher';
import { KyberswapClassicContractFactory } from './contracts';
import { EthereumKyberSwapClassicFarmContractPositionFetcher } from './ethereum/kyberswap-classic.farm.contract-position-fetcher';
import { EthereumKyberSwapClassicPoolTokenFetcher } from './ethereum/kyberswap-classic.pool.token-fetcher';
import { FantomKyberSwapClassicPoolTokenFetcher } from './fantom/kyberswap-classic.pool.token-fetcher';
import { OptimismKyberSwapClassicPoolTokenFetcher } from './optimism/kyberswap-classic.pool.token-fetcher';
import { PolygonKyberSwapDmmClassicPoolTokenFetcher } from './polygon/kyberswap-classic.dmm-pool.token-fetcher';
import { PolygonKyberSwapClassicFarmContractPositionFetcher } from './polygon/kyberswap-classic.farm.contract-position-fetcher';
import { PolygonKyberSwapKsClassicPoolTokenFetcher } from './polygon/kyberswap-classic.ks-pool.token-fetcher';
import { PolygonKyberSwapClassicLegacyFarmContractPositionFetcher } from './polygon/kyberswap-classic.legacy-farm.contract-position-fetcher';

@Module({
  providers: [
    KyberswapClassicContractFactory,
    UniswapV2ContractFactory,
    EthereumKyberSwapClassicPoolTokenFetcher,
    EthereumKyberSwapClassicFarmContractPositionFetcher,
    PolygonKyberSwapDmmClassicPoolTokenFetcher,
    PolygonKyberSwapKsClassicPoolTokenFetcher,
    PolygonKyberSwapClassicFarmContractPositionFetcher,
    PolygonKyberSwapClassicLegacyFarmContractPositionFetcher,
    AvalancheKyberSwapClassicPoolTokenFetcher,
    AvalancheKyberSwapClassicFarmContractPositionFetcher,
    FantomKyberSwapClassicPoolTokenFetcher,
    ArbitrumKyberSwapClassicPoolTokenFetcher,
    BinanceSmartChainKyberSwapClassicFarmContractPositionFetcher,
    BinanceSmartChainKyberSwapClassicPoolTokenFetcher,
    OptimismKyberSwapClassicPoolTokenFetcher,
  ],
})
export class KyberSwapClassicAppModule extends AbstractApp() {}
