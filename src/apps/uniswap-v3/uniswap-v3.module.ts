import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumUniswapV3LiquidityContractPositionFetcher } from './arbitrum/uniswap-v3.liquidity.contract-position-fetcher';
import { UniswapV3LiquidityContractPositionBuilder } from './common/uniswap-v3.liquidity.contract-position-builder';
import { UniswapV3ContractFactory } from './contracts';
import { EthereumUniswapV3LiquidityContractPositionFetcher } from './ethereum/uniswap-v3.liquidity.contract-position-fetcher';
import { OptimismUniswapV3LiquidityContractPositionFetcher } from './optimism/uniswap-v3.liquidity.contract-position-fetcher';
import { PolygonUniswapV3LiquidityContractPositionFetcher } from './polygon/uniswap-v3.liquidity.contract-position-fetcher';
import { UniswapV3AppDefinition, UNISWAP_V3_DEFINITION } from './uniswap-v3.definition';

@Register.AppModule({
  appId: UNISWAP_V3_DEFINITION.id,
  providers: [
    UniswapV3AppDefinition,
    UniswapV3ContractFactory,
    UniswapV3LiquidityContractPositionBuilder,
    ArbitrumUniswapV3LiquidityContractPositionFetcher,
    EthereumUniswapV3LiquidityContractPositionFetcher,
    OptimismUniswapV3LiquidityContractPositionFetcher,
    PolygonUniswapV3LiquidityContractPositionFetcher,
  ],
  exports: [UniswapV3ContractFactory],
})
export class UniswapV3AppModule extends AbstractApp() {}
