import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2/contracts';

import { ArbitrumKyberSwapClassicFarmContractPositionFetcher } from './arbitrum/kyberswap-classic.farm-v2.contract-position-fetcher';
import { ArbitrumKyberSwapClassicKsPoolTokenFetcher } from './arbitrum/kyberswap-classic.ks-pool.token-fetcher';
import { AvalancheKyberSwapDmmClassicDmmPoolTokenFetcher } from './avalanche/kyberswap-classic.dmm-pool.token-fetcher';
import { AvalancheKyberSwapClassicFarmContractPositionFetcher } from './avalanche/kyberswap-classic.farm-v2.contract-position-fetcher';
import { AvalancheKyberSwapKsClassicKsPoolTokenFetcher } from './avalanche/kyberswap-classic.ks-pool.token-fetcher';
import { BinanceSmartChainKyberSwapClassicDmmPoolTokenFetcher } from './binance-smart-chain/kyberswap-classic.dmm-pool.token-fetcher';
import { BinanceSmartChainKyberSwapClassicFarmV2ContractPositionFetcher } from './binance-smart-chain/kyberswap-classic.farm-v2.contract-position-fetcher';
import { BinanceSmartChainKyberSwapClassicKsPoolTokenFetcher } from './binance-smart-chain/kyberswap-classic.ks-pool.token-fetcher';
import { KyberswapClassicContractFactory } from './contracts';
import { EthereumKyberSwapClassicDmmPoolTokenFetcher } from './ethereum/kyberswap-classic.dmm-pool.token-fetcher';
import { EthereumKyberSwapClassicFarmContractPositionFetcher } from './ethereum/kyberswap-classic.farm.contract-position-fetcher';
import { EthereumKyberSwapClassicKsPoolTokenFetcher } from './ethereum/kyberswap-classic.ks-pool.token-fetcher';
import { FantomKyberSwapClassicDmmPoolTokenFetcher } from './fantom/kyberswap-classic.dmm-pool.token-fetcher';
import { FantomKyberSwapClassicKsPoolTokenFetcher } from './fantom/kyberswap-classic.ks-pool.token-fetcher';
import { OptimismKyberSwapClassicFarmContractPositionFetcher } from './optimism/kyberswap-classic.farm-v2.contract-position-fetcher';
import { OptimismKyberSwapClassicKsPoolTokenFetcher } from './optimism/kyberswap-classic.ks-pool.token-fetcher';
import { PolygonKyberSwapDmmClassicPoolTokenFetcher } from './polygon/kyberswap-classic.dmm-pool.token-fetcher';
import { PolygonKyberSwapClassicFarmV2ContractPositionFetcher } from './polygon/kyberswap-classic.farm-v2.contract-position-fetched';
import { PolygonKyberSwapClassicFarmContractPositionFetcher } from './polygon/kyberswap-classic.farm.contract-position-fetcher';
import { PolygonKyberSwapKsClassicPoolTokenFetcher } from './polygon/kyberswap-classic.ks-pool.token-fetcher';
import { PolygonKyberSwapClassicLegacyFarmContractPositionFetcher } from './polygon/kyberswap-classic.legacy-farm.contract-position-fetcher';

@Module({
  providers: [
    KyberswapClassicContractFactory,
    UniswapV2ContractFactory,
    EthereumKyberSwapClassicKsPoolTokenFetcher,
    EthereumKyberSwapClassicDmmPoolTokenFetcher,
    EthereumKyberSwapClassicFarmContractPositionFetcher,
    PolygonKyberSwapDmmClassicPoolTokenFetcher,
    PolygonKyberSwapKsClassicPoolTokenFetcher,
    PolygonKyberSwapClassicFarmContractPositionFetcher,
    PolygonKyberSwapClassicLegacyFarmContractPositionFetcher,
    PolygonKyberSwapClassicFarmV2ContractPositionFetcher,
    AvalancheKyberSwapKsClassicKsPoolTokenFetcher,
    AvalancheKyberSwapDmmClassicDmmPoolTokenFetcher,
    AvalancheKyberSwapClassicFarmContractPositionFetcher,
    FantomKyberSwapClassicKsPoolTokenFetcher,
    FantomKyberSwapClassicDmmPoolTokenFetcher,
    ArbitrumKyberSwapClassicKsPoolTokenFetcher,
    ArbitrumKyberSwapClassicFarmContractPositionFetcher,
    BinanceSmartChainKyberSwapClassicFarmV2ContractPositionFetcher,
    BinanceSmartChainKyberSwapClassicKsPoolTokenFetcher,
    BinanceSmartChainKyberSwapClassicDmmPoolTokenFetcher,
    OptimismKyberSwapClassicKsPoolTokenFetcher,
    OptimismKyberSwapClassicFarmContractPositionFetcher,
  ],
})
export class KyberSwapClassicAppModule extends AbstractApp() {}
