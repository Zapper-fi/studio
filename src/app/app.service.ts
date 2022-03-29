import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { fromPairs } from 'lodash';

import { AppToolkit } from '~app-toolkit/app-toolkit.service';

import { AppRegistry } from './app.registry';
import { AppBalanceFetcherRegistry } from './balance-fetcher.registry';
import { GetAppBalancesQuery } from './dto/get-app-balances-query.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject(AppRegistry) private readonly appRegistry: AppRegistry,
    @Inject(AppBalanceFetcherRegistry) private readonly balanceFetcherRegistry: AppBalanceFetcherRegistry,
    @Inject(AppToolkit) private readonly appToolkit: AppToolkit,
  ) {}

  async getApps() {
    return this.appRegistry.getSupported();
  }

  getApp(appId: string) {
    return this.appRegistry.get(appId);
  }

  async getAppBalances({ appId, addresses, network }: GetAppBalancesQuery & { appId: string }) {
    try {
      const fetcher = this.balanceFetcherRegistry.get(appId, network);
      const balances = await Promise.all(
        addresses.map(async address =>
          fetcher
            .getBalances(address)
            .then(balance => [address, balance])
            .catch(e => [address, { error: e }]),
        ),
      );

      return fromPairs(balances);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
