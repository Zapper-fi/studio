import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { ArbitrumSushiswapBalanceFetcher } from './arbitrum/sushiswap.balance-fetcher';
import { ArbitrumSushiSwapChefV2FarmContractPositionFetcher } from './arbitrum/sushiswap.chef-v2-farm.contract-position-fetcher';
import { ArbitrumSushiswapPoolTokenFetcher } from './arbitrum/sushiswap.pool.token-fetcher';
import { AvalancheSushiswapBalanceFetcher } from './avalanche/sushiswap.balance-fetcher';
import { AvalancheSushiswapPoolTokenFetcher } from './avalanche/sushiswap.pool.token-fetcher';
import { BinanceSmartChainSushiswapBalanceFetcher } from './binance-smart-chain/sushiswap.balance-fetcher';
import { BinanceSmartChainSushiswapPoolTokenFetcher } from './binance-smart-chain/sushiswap.pool.token-fetcher';
import { CeloSushiswapBalanceFetcher } from './celo/sushiswap.balance-fetcher';
import { CeloSushiSwapChefV2FarmContractPositionFetcher } from './celo/sushiswap.chef-v2-farm.contract-position-fetcher';
import { CeloSushiswapPoolTokenFetcher } from './celo/sushiswap.pool.token-fetcher';
import { SushiswapContractFactory } from './contracts';
import { EthereumSushiswapBalanceFetcher } from './ethereum/sushiswap.balance-fetcher';
import { EthereumSushiSwapChefV1FarmContractPositionFetcher } from './ethereum/sushiswap.chef-v1-farm.contract-position-fetcher';
import { EthereumSushiSwapChefV2FarmContractPositionFetcher } from './ethereum/sushiswap.chef-v2-farm.contract-position-fetcher';
import { EthereumSushiswapPoolTokenFetcher } from './ethereum/sushiswap.pool.token-fetcher';
import { FantomSushiswapBalanceFetcher } from './fantom/sushiswap.balance-fetcher';
import { FantomSushiswapPoolTokenFetcher } from './fantom/sushiswap.pool.token-fetcher';
import { GnosisSushiswapBalanceFetcher } from './gnosis/sushiswap.balance-fetcher';
import { GnosisSushiSwapChefV2FarmContractPositionFetcher } from './gnosis/sushiswap.chef-v2-farm.contract-position-fetcher';
import { GnosisSushiswapPoolTokenFetcher } from './gnosis/sushiswap.pool.token-fetcher';
import { PolygonSushiswapBalanceFetcher } from './polygon/sushiswap.balance-fetcher';
import { PolygonSushiSwapChefV2FarmContractPositionFetcher } from './polygon/sushiswap.chef-v2-farm.contract-position-fetcher';
import { PolygonSushiswapPoolTokenFetcher } from './polygon/sushiswap.pool.token-fetcher';
import { SushiswapAppDefinition, SUSHISWAP_DEFINITION } from './sushiswap.definition';

@Register.AppModule({
  appId: SUSHISWAP_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    SushiswapAppDefinition,
    SushiswapContractFactory,
    // Arbitrum
    ArbitrumSushiswapPoolTokenFetcher,
    ArbitrumSushiswapBalanceFetcher,
    ArbitrumSushiSwapChefV2FarmContractPositionFetcher,
    // Avalanche
    AvalancheSushiswapBalanceFetcher,
    AvalancheSushiswapPoolTokenFetcher,
    // Binance Smart Chain
    BinanceSmartChainSushiswapBalanceFetcher,
    BinanceSmartChainSushiswapPoolTokenFetcher,
    // Celo
    CeloSushiswapBalanceFetcher,
    CeloSushiswapPoolTokenFetcher,
    CeloSushiSwapChefV2FarmContractPositionFetcher,
    // Ethereum
    EthereumSushiswapPoolTokenFetcher,
    EthereumSushiswapBalanceFetcher,
    EthereumSushiSwapChefV1FarmContractPositionFetcher,
    EthereumSushiSwapChefV2FarmContractPositionFetcher,
    // Fantom
    FantomSushiswapPoolTokenFetcher,
    FantomSushiswapBalanceFetcher,
    // Gnosis
    GnosisSushiswapBalanceFetcher,
    GnosisSushiswapPoolTokenFetcher,
    GnosisSushiSwapChefV2FarmContractPositionFetcher,
    // Polygon
    PolygonSushiswapBalanceFetcher,
    PolygonSushiswapPoolTokenFetcher,
    PolygonSushiSwapChefV2FarmContractPositionFetcher,
  ],
  exports: [SushiswapContractFactory],
})
export class SushiswapAppModule extends AbstractApp() {}
