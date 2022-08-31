import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { SynthetixSingleStakingFarmContractPositionBalanceHelper } from '~apps/synthetix';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { MSTABLE_DEFINITION } from '../mstable.definition';

const appId = MSTABLE_DEFINITION.id;
const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(appId, network)
export class PolygonMstableBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SynthetixSingleStakingFarmContractPositionBalanceHelper)
    private readonly synthetix: SynthetixSingleStakingFarmContractPositionBalanceHelper,
  ) {}

  private getImUsdTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId: MSTABLE_DEFINITION.groups.imusd.id,
      network,
    });
  }

  private async getSavingsVaultBalances(address: string) {
    return this.synthetix.getBalances({
      appId,
      network,
      groupId: MSTABLE_DEFINITION.groups.savingsVault.id,
      address,
    });
  }

  async getBalances(address: string) {
    const [imUsdTokenBalances, savingsVaultBalances] = await Promise.all([
      this.getImUsdTokenBalances(address),
      this.getSavingsVaultBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'imUSD',
        assets: imUsdTokenBalances,
      },
      {
        label: 'Savings Vaults',
        assets: savingsVaultBalances,
      },
    ]);
  }
}
