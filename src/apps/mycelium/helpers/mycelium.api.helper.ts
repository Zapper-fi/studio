import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { Network } from '~types';

import MYCELIUM_DEFINITION from '../mycelium.definition';

import { MYCELIUM_API_URL } from './mycelium.constants';
import {
  MyceliumPoolInfosApiResponse,
  MyceliumPoolPrices,
  MyceliumPoolsApiDatas,
  MyceliumPoolsApiResponse,
} from './mycelium.interface';

const appId = MYCELIUM_DEFINITION.id;
const groupId = MYCELIUM_DEFINITION.groups.perpFarms.id;
const network = Network.ARBITRUM_MAINNET;

@Injectable()
export class MyceliumApiHelper {
  constructor() {}

  @CacheOnInterval({
    key: `studio:${network}:${appId}:${groupId}:pools`,
    timeout: 5 * 60 * 1000,
  })
  async getMyceliumPools(): Promise<Array<MyceliumPoolsApiDatas>> {
    try {
      const data = await axios
        .get<MyceliumPoolsApiResponse>(`${MYCELIUM_API_URL}/poolList?network=42161&list=verified`)
        .then(v => v.data);
      return data.pools;
    } catch (err) {
      return [];
    }
  }

  async getMyceliumPoolTokensPrices(poolAddress: string): Promise<MyceliumPoolPrices> {
    try {
      const data = await axios
        .get<MyceliumPoolInfosApiResponse>(`${MYCELIUM_API_URL}/nextPoolState?network=42161&poolAddress=${poolAddress}`)
        .then(v => v.data);

      return {
        longTokenPrice: parseFloat(data.expectedLongTokenPrice),
        shortTokenPrice: parseFloat(data.expectedShortTokenPrice),
      };
    } catch (err) {
      return {
        longTokenPrice: 0,
        shortTokenPrice: 0,
      };
    }
  }
}
