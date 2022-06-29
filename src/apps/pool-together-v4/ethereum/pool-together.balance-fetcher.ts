import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { POOL_TOGETHER_DEFINITION } from '../pool-together.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(POOL_TOGETHER_DEFINITION.id, network)
export class EthereumPoolTogetherBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getV4TokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: POOL_TOGETHER_DEFINITION.id,
      groupId: POOL_TOGETHER_DEFINITION.groups.v4.id,
      address,
    });
  }

  async getBalances(address: string) {
    const [v4TokenBalance] = await Promise.all([this.getV4TokenBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'PoolTogether',
        assets: v4TokenBalance,
      },
    ]);
  }
}
