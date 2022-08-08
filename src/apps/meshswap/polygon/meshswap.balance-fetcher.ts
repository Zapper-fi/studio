import { Inject } from '@nestjs/common';

import { TokenBalanceHelper } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { MeshswapSupplyBalanceHelper } from '../helpers/meshpool.supply.balance-helper';
import { MESHSWAP_DEFINITION } from '../meshswap.definition';

const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(MESHSWAP_DEFINITION.id, network)
export class PolygonMeshswapBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(MeshswapSupplyBalanceHelper) private readonly meshswapSupplyBalanceHelper: MeshswapSupplyBalanceHelper,
    @Inject(TokenBalanceHelper) private readonly tokenBalanceHelper: TokenBalanceHelper,
  ) {}

  private async getSupplyBalance(address: string) {
    return this.meshswapSupplyBalanceHelper.getSupplyBalances({
      address,
      appId: MESHSWAP_DEFINITION.id,
      groupId: MESHSWAP_DEFINITION.groups.supply.id,
      network,
    });
  }

  private async getPoolBalances(address: string) {
    return await this.tokenBalanceHelper.getTokenBalances({
      network,
      appId: MESHSWAP_DEFINITION.id,
      groupId: MESHSWAP_DEFINITION.groups.pool.id,
      address,
    });
  }

  async getBalances(address: string) {
    const [supplyBalance, poolBalance] = await Promise.all([
      this.getSupplyBalance(address),
      this.getPoolBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolBalance,
      },
      {
        label: 'Supply',
        assets: supplyBalance,
      },
    ]);
  }
}
