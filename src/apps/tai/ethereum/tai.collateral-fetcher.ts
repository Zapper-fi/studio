import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';
import { mapKeys, map, pickBy, toPairs } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';

import { TaiContractFactory, TaiSafeJoin } from '../contracts';
import { Network } from '~types/network.interface';

@Injectable()
export class TaiCollateralResolver {
  constructor(
    @Inject(TaiContractFactory) protected readonly contractFactory: TaiContractFactory,
  ) {
  }

  @Cache({
    key: `studio:tai:collateral`,
    ttl: 15 * 60,
  })
  async getCollateralTypes(network: Network): Promise<Record<string, string>> {
    const { data } = await Axios.get<Record<string, string>>(`https://raw.githubusercontent.com/money-god/mgl-changelog/master/mainnet/contracts.json`);
    const results = toPairs(mapKeys(pickBy(data, (_, k) => k.includes('GEB_JOIN_')), (_, k) => k.replace('GEB_JOIN_', '').replace('_', '-')))

    const collaterals = await Promise.all(map(results, async ([name, address]) => {
      const contract = this.contractFactory.taiCollateralJoin({ address, network })
      const collateral = await contract.collateral()
      return [name, collateral]
    }))

    return collaterals.reduce((acc, [key, value]) => {
      acc[key] = value.toLowerCase()
      return acc
    }, {})
  }
}
