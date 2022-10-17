import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { Cache } from '~cache/cache.decorator';

export type UmamiApiResponse = {
  marinate: {
    apr: string;
    apy: string;
  };
};

@Injectable()
export class UmamiFinanceYieldResolver {
  @Cache({
    key: `studio:umami-finance:marinate`,
    ttl: 5 * 60, // 60 minutes
  })
  async getYield() {
    const { data } = await Axios.get<UmamiApiResponse>(`https://api.umami.finance/api/v1/marinate`);
    return data;
  }
}
