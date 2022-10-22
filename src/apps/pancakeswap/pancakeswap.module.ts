import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { BinanceSmartChainPancakeswapAutoCakeContractPositionFetcher } from './binance-smart-chain/pancakeswap.auto-cake.contract-position-fetcher';
import { BinanceSmartChainPancakeswapFarmV2ContractPositionFetcher } from './binance-smart-chain/pancakeswap.farm-v2.cotract-position-fetcher';
import { BinanceSmartChainPancakeswapFarmContractPositionFetcher } from './binance-smart-chain/pancakeswap.farm.contract-position-fetcher';
import { BinanceSmartChainPancakeswapIfoCakeContractPositionFetcher } from './binance-smart-chain/pancakeswap.ifo-cake.contract-position-fetcher';
import { BinanceSmartChainPancakeswapPoolAddressCacheManager } from './binance-smart-chain/pancakeswap.pool.cache-manager';
import { BinanceSmartChainPancakeSwapPoolTokenFetcher } from './binance-smart-chain/pancakeswap.pool.token-fetcher';
import { BinanceSmartChainPancakeswapSyrupCakeContractPositionFetcher } from './binance-smart-chain/pancakeswap.syrup-cake.contract-position-fetcher';
import { BinanceSmartChainPancakeswapSyrupStakingContractPositionFetcher } from './binance-smart-chain/pancakeswap.syrup-staking.contract-position-fetcher';
import { PancakeswapContractFactory } from './contracts';
import { PancakeswapAppDefinition, PANCAKESWAP_DEFINITION } from './pancakeswap.definition';

@Register.AppModule({
  appId: PANCAKESWAP_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    PancakeswapAppDefinition,
    PancakeswapContractFactory,
    BinanceSmartChainPancakeswapAutoCakeContractPositionFetcher,
    BinanceSmartChainPancakeswapIfoCakeContractPositionFetcher,
    BinanceSmartChainPancakeswapFarmContractPositionFetcher,
    BinanceSmartChainPancakeswapFarmV2ContractPositionFetcher,
    BinanceSmartChainPancakeswapSyrupCakeContractPositionFetcher,
    BinanceSmartChainPancakeswapSyrupStakingContractPositionFetcher,
    BinanceSmartChainPancakeSwapPoolTokenFetcher,
    BinanceSmartChainPancakeswapPoolAddressCacheManager,
  ],
  exports: [PancakeswapContractFactory],
})
export class PancakeSwapAppModule extends AbstractApp() {}
