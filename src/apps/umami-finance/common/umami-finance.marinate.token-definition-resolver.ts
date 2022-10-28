import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { Cache } from '~cache/cache.decorator';

type UmamiMetric = {
  key: 'apy' | 'apr';
  label: string;
  value: string;
  context: string;
};

export type UmamiApiResponse = {
  metrics: Array<UmamiMetric>;
};

@Injectable()
export class UmamiFinanceYieldResolver {
  @Cache({
    key: `studio:umami-finance:marinate`,
    ttl: 5 * 60, // 60 minutes
  })
  async getYield() {
    const { data } = await Axios.get<UmamiApiResponse>(
      `https://api.umami.finance/api/v2/staking/metrics/current?keys=apy&keys=apr`,
    );
    return {
      apy: data.metrics[0].value,
      apr: data.metrics[1].value,
    };
  }
}
