import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { Network } from '~types/network.interface';

import BALANCER_V1_DEFINITION from '../balancer-v1.definition';

const appId = BALANCER_V1_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class EthereumBalancerV1BalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBalances(address: string) {
    const balances = await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      appId,
      groupId: BALANCER_V1_DEFINITION.groups.pool.id,
      network,
      address,
    });

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: balances,
      },
    ]);
  }
}
