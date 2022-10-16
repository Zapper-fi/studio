import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { OpenskyContractFactory } from '~apps/opensky';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { OPENSKY_DEFINITION } from '../opensky.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(OPENSKY_DEFINITION.id, network)
export class EthereumOpenskyBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OpenskyContractFactory) private readonly openskyContractFactory: OpenskyContractFactory,
  ) {}

  async getSupplyBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: OPENSKY_DEFINITION.id,
      groupId: OPENSKY_DEFINITION.groups.supply.id,
      network: Network.ETHEREUM_MAINNET,
    });
  }
  async getBalances(address: string) {
    const [supplyBalances] = await Promise.all([this.getSupplyBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Supply',
        assets: supplyBalances,
      },
    ]);
  }
}
