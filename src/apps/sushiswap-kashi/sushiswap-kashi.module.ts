import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumSushiswapKashiBalanceFetcher } from './arbitrum/sushiswap-kashi.balance-fetcher';
import { ArbitrumSushiswapKashiLendingTokenFetcher } from './arbitrum/sushiswap-kashi.lending.token-fetcher';
import { BinanceSmartChainSushiswapKashiBalanceFetcher } from './binance-smart-chain/sushiswap-kashi.balance-fetcher';
import { BinanceSmartChainSushiswapKashiLendingTokenFetcher } from './binance-smart-chain/sushiswap-kashi.lending.token-fetcher';
import { SushiswapKashiContractFactory } from './contracts';
import { EthereumSushiswapKashiBalanceFetcher } from './ethereum/sushiswap-kashi.balance-fetcher';
import { EthereumSushiswapKashiLendingTokenFetcher } from './ethereum/sushiswap-kashi.lending.token-fetcher';
import { SushiSwapKashiLendingBalanceHelper } from './helpers/sushiswap-kashi.lending.balance-helper';
import { SushiswapKashiLendingTokenHelper } from './helpers/sushiswap-kashi.lending.token-helper';
import { PolygonSushiswapKashiBalanceFetcher } from './polygon/sushiswap-kashi.balance-fetcher';
import { PolygonSushiswapKashiLendingTokenFetcher } from './polygon/sushiswap-kashi.lending.token-fetcher';
import { SushiswapKashiAppDefinition, SUSHISWAP_KASHI_DEFINITION } from './sushiswap-kashi.definition';

@Register.AppModule({
  appId: SUSHISWAP_KASHI_DEFINITION.id,
  providers: [
    SushiswapKashiAppDefinition,
    SushiswapKashiContractFactory,
    SushiswapKashiLendingTokenHelper,
    SushiSwapKashiLendingBalanceHelper,
    // Arbitrum
    ArbitrumSushiswapKashiBalanceFetcher,
    ArbitrumSushiswapKashiLendingTokenFetcher,
    // Binance Smart Chain
    BinanceSmartChainSushiswapKashiBalanceFetcher,
    BinanceSmartChainSushiswapKashiLendingTokenFetcher,
    // Ethereum
    EthereumSushiswapKashiBalanceFetcher,
    EthereumSushiswapKashiLendingTokenFetcher,
    // Polygon
    PolygonSushiswapKashiBalanceFetcher,
    PolygonSushiswapKashiLendingTokenFetcher,
  ],
})
export class SushiSwapKashiAppModule extends AbstractApp() {}
