import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { CacheOnInterval } from '~cache/cache-on-interval.decorator';

import { OPENLEVERAGE_DEFINITION } from '../openleverage.definition';

@Injectable()
export class OpenleveragePoolAPYHelper {
  @CacheOnInterval({
    key: `studio:${OPENLEVERAGE_DEFINITION.id}:${OPENLEVERAGE_DEFINITION.groups.pool.id}:openleverage-definitions-data`,
    timeout: 5 * 60 * 1000,
  })
  async getApy() {
    const poolDetailMap = {};
    const bnbEndpoint = `https://bnb.openleverage.finance/api/info/pool/apy`;
    const ethEndpoint = `https://eth.openleverage.finance/api/info/pool/apy`;
    const bnbData = await Axios.get(bnbEndpoint);
    bnbData.data?.forEach(pool => {
      poolDetailMap[pool.poolAddr] = {
        lendingYieldY: pool.lendingYieldY,
        token1Symbol: pool.token1Symbol,
      };
    });

    const ethData = await Axios.get(ethEndpoint);
    ethData.data?.forEach(pool => {
      poolDetailMap[pool.poolAddr] = {
        lendingYieldY: pool.lendingYieldY,
        token1Symbol: pool.token1Symbol,
      };
    });
    return poolDetailMap;
  }
}
