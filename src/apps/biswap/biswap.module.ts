import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2';

import { BinanceSmartChainBiswapContractPositionFetcher } from './binance-smart-chain/biswap.farm.contract-position-fetcher';
import { BinanceSmartChainBiswapPoolTokenFetcher } from './binance-smart-chain/biswap.pool.token-fetcher';
import { BiswapAppDefinition, BISWAP_DEFINITION } from './biswap.definition';
import { BiswapContractFactory } from './contracts';

@Register.AppModule({
  appId: BISWAP_DEFINITION.id,
  providers: [
    UniswapV2ContractFactory,
    BiswapAppDefinition,
    BiswapContractFactory,
    BinanceSmartChainBiswapPoolTokenFetcher,
    BinanceSmartChainBiswapContractPositionFetcher,
  ],
})
export class BiswapAppModule extends AbstractApp() {}
