import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { POOL_TOGETHER_V4_DEFINITION } from '../pool-together-v4.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(POOL_TOGETHER_V4_DEFINITION.id, network)
export class EthereumPoolTogetherV4BalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTicketBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: POOL_TOGETHER_V4_DEFINITION.id,
      groupId: POOL_TOGETHER_V4_DEFINITION.groups.ticket.id,
      address,
    });
  }

  async getBalances(address: string) {
    const [ticketBalance] = await Promise.all([this.getTicketBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'PoolTogether',
        assets: ticketBalance,
      },
    ]);
  }
}
