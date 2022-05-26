import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { YIELD_PROTOCOL_DEFINITION } from '../yield-protocol.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(YIELD_PROTOCOL_DEFINITION.id, network)
export class EthereumYieldProtocolBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getLendBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: YIELD_PROTOCOL_DEFINITION.id,
      groupId: YIELD_PROTOCOL_DEFINITION.groups.lend.id,
      network: Network.ETHEREUM_MAINNET,
    });
  }

  async getPoolBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: YIELD_PROTOCOL_DEFINITION.id,
      groupId: YIELD_PROTOCOL_DEFINITION.groups.pool.id,
      network: Network.ETHEREUM_MAINNET,
    });
  }

  async getBalances(address: string) {
    const [lendBalances, poolBalances] = await Promise.all([
      this.getLendBalances(address),
      this.getPoolBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      { label: 'Lend', assets: lendBalances },
      { label: 'Pool', assets: poolBalances },
    ]);
  }
}
