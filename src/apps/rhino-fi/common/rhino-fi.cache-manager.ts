import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { toPairs } from 'lodash';

import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';

import { RHINO_FI_DEFINITION } from '../rhino-fi.definition';

type TokenRegistryResponse = {
  decimals: number;
  quantization: number;
  minOrderSize: number;
  transferFee: number;
  starkTokenId: string;
  fastWithdrawalRequiredGas: number;
  tokenAddressPerChain: {
    ETHEREUM: string;
  };
};

type ConfigResponse = {
  tokenRegistry: Record<string, TokenRegistryResponse>;
};

@Injectable()
export class RhinoFiCacheManager {
  constructor() {}

  @CacheOnInterval({
    key: `studio:${RHINO_FI_DEFINITION.id}:supported-tokens:data`,
    timeout: 15 * 60 * 1000,
  })
  async getCachedSupportedTokens() {
    const { data } = await axios.post<ConfigResponse>('https://api.rhino.fi/v1/trading/r/getConf');
    const result = toPairs(data.tokenRegistry)
      .map(([symbol, tokenConfig]) => ({
        symbol: symbol,
        address: symbol === 'ETH' ? ZERO_ADDRESS : tokenConfig.tokenAddressPerChain.ETHEREUM.toLowerCase(),
        quantization: tokenConfig.quantization,
      }))
      .filter(v => !/0x000000000000000000000000000000000000dea./g.test(v.address));
    return result;
  }
}
