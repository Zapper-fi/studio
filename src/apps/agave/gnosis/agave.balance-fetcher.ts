import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { AaveV2LendingBalanceHelper, AaveV2ClaimableBalanceHelper, AaveV2HealthFactorMetaHelper } from '~apps/aave-v2';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { AGAVE_DEFINITION } from '../agave.definition';

const network = Network.GNOSIS_MAINNET;

@Register.BalanceFetcher(AGAVE_DEFINITION.id, network)
export class GnosisAgaveBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AaveV2LendingBalanceHelper) private readonly aaveV2LendingBalanceHelper: AaveV2LendingBalanceHelper,
    @Inject(AaveV2ClaimableBalanceHelper) private readonly aaveV2ClaimableBalanceHelper: AaveV2ClaimableBalanceHelper,
    @Inject(AaveV2HealthFactorMetaHelper) private readonly healthFactorHelper: AaveV2HealthFactorMetaHelper,
  ) {}

  async getLendingBalances(address: string) {
    return Promise.all([
      this.aaveV2LendingBalanceHelper.getLendingContractPositionBalances({
        address,
        appId: AGAVE_DEFINITION.id,
        groupId: AGAVE_DEFINITION.groups.deposit.id,
        network,
      }),
      this.aaveV2LendingBalanceHelper.getLendingContractPositionBalances({
        address,
        appId: AGAVE_DEFINITION.id,
        groupId: AGAVE_DEFINITION.groups.stableBorrow.id,
        network,
        isDebt: true,
      }),
      this.aaveV2LendingBalanceHelper.getLendingContractPositionBalances({
        address,
        appId: AGAVE_DEFINITION.id,
        groupId: AGAVE_DEFINITION.groups.variableBorrow.id,
        network,
        isDebt: true,
      }),
    ]).then(v => v.flat());
  }

  private async getClaimableBalances(address: string) {
    return this.aaveV2ClaimableBalanceHelper.getClaimableBalances({
      address,
      appId: AGAVE_DEFINITION.id,
      groupId: AGAVE_DEFINITION.groups.claimable.id,
      network,
    });
  }

  private async getHealthFactorMeta(address: string) {
    return this.healthFactorHelper.getHealthFactor({
      address,
      network,
      lendingPoolAddress: '0x5E15d5E33d318dCEd84Bfe3F4EACe07909bE6d9c',
    });
  }

  async getBalances(address: string) {
    const [lendingBalances, claimable, healthFactorMeta] = await Promise.all([
      this.getLendingBalances(address),
      this.getClaimableBalances(address),
      this.getHealthFactorMeta(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Lending',
        assets: lendingBalances,
        meta: lendingBalances.find(v => v.balanceUSD < 0) ? [healthFactorMeta] : [],
      },
      {
        label: 'Reward',
        assets: claimable,
      },
    ]);
  }
}
