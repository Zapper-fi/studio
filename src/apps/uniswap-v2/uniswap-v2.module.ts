import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { UniswapV2ContractFactory } from './contracts';
import { EthereumUniswapV2PoolTokenFetcher } from './ethereum/uniswap-v2.pool.token-fetcher';
import { UniswapV2OnChainPoolTokenAddressStrategy } from './helpers/uniswap-v2.on-chain.pool-token-address-strategy';
import { UniswapV2OnChainTokenDerivationStrategy } from './helpers/uniswap-v2.on-chain.token-derivation-strategy';
import { UniswapV2PoolTokenHelper } from './helpers/uniswap-v2.pool.token-helper';
import { UniswapV2TheGraphPoolTokenAddressStrategy } from './helpers/uniswap-v2.the-graph.pool-token-address-strategy';
import { UniswapV2TheGraphPoolTokenBalanceHelper } from './helpers/uniswap-v2.the-graph.pool-token-balance-helper';
import { UniswapV2TheGraphPoolVolumeStrategy } from './helpers/uniswap-v2.the-graph.pool-volume-strategy';
import { UNISWAP_V2_DEFINITION, UniswapV2AppDefinition } from './uniswap-v2.definition';

@Register.AppModule({
  appId: UNISWAP_V2_DEFINITION.id,
  providers: [
    UniswapV2AppDefinition,
    UniswapV2ContractFactory,
    EthereumUniswapV2PoolTokenFetcher,
    // Helpers
    UniswapV2PoolTokenHelper,
    UniswapV2OnChainPoolTokenAddressStrategy,
    UniswapV2OnChainTokenDerivationStrategy,
    UniswapV2TheGraphPoolTokenAddressStrategy,
    UniswapV2TheGraphPoolVolumeStrategy,
    UniswapV2TheGraphPoolTokenBalanceHelper,
  ],
  exports: [
    UniswapV2ContractFactory,
    UniswapV2PoolTokenHelper,
    UniswapV2OnChainPoolTokenAddressStrategy,
    UniswapV2OnChainTokenDerivationStrategy,
    UniswapV2TheGraphPoolTokenAddressStrategy,
    UniswapV2TheGraphPoolVolumeStrategy,
    UniswapV2TheGraphPoolTokenBalanceHelper,
  ],
})
export class UniswapV2AppModule extends AbstractApp() {}
