import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { BinanceSmartChainBiswapBalanceFetcher } from './binance-smart-chain/biswap.balance-fetcher';
import { BinanceSmartChainBiswapContractPositionFetcher } from './binance-smart-chain/biswap.farm.contract-position-fetcher';
import { BinanceSmartChainBiswapPoolTokenFetcher } from './binance-smart-chain/biswap.pool.token-fetcher';
import { BiswapAppDefinition, BISWAP_DEFINITION } from './biswap.definition';
import { BiswapContractFactory } from './contracts';

@Register.AppModule({
  appId: BISWAP_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    BiswapAppDefinition,
    BiswapContractFactory,
    BinanceSmartChainBiswapBalanceFetcher,
    BinanceSmartChainBiswapPoolTokenFetcher,
    BinanceSmartChainBiswapContractPositionFetcher,
  ],
})
export class BiswapAppModule extends AbstractApp() {}
