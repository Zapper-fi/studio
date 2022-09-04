import { Injectable } from '@nestjs/common';

import { UniswapV2PoolOnChainTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.pool.on-chain.template.token-fetcher';
import { Network } from '~types/network.interface';

import { BISWAP_DEFINITION } from '../biswap.definition';

@Injectable()
export class BinanceSmartChainBiswapPoolTokenFetcher extends UniswapV2PoolOnChainTemplateTokenFetcher {
  appId = BISWAP_DEFINITION.id;
  groupId = BISWAP_DEFINITION.groups.pool.id;
  network = Network.BINANCE_SMART_CHAIN_MAINNET;
  groupLabel = 'Pools';
  factoryAddress = '0x858e3312ed3a876947ea49d572a7c42de08af7ee';
}
