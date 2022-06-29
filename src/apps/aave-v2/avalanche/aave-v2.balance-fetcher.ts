import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { AAVE_V2_DEFINITION } from '../aave-v2.definition';
import { AaveV2ClaimableBalanceHelper } from '../helpers/aave-v2.claimable.balance-helper';
import { AaveV2HealthFactorMetaHelper } from '../helpers/aave-v2.health-factor-meta-helper';
import { AaveV2LendingBalanceHelper } from '../helpers/aave-v2.lending.balance-helper';

const network = Network.AVALANCHE_MAINNET;

@Register.BalanceFetcher(AAVE_V2_DEFINITION.id, Network.AVALANCHE_MAINNET)
export class AvalancheAaveV2BalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(AaveV2LendingBalanceHelper) private readonly aaveV2LendingBalanceHelper: AaveV2LendingBalanceHelper,
    @Inject(AaveV2ClaimableBalanceHelper) private readonly aaveV2ClaimableBalanceHelper: AaveV2ClaimableBalanceHelper,
    @Inject(AaveV2HealthFactorMetaHelper) private readonly healthFactorHelper: AaveV2HealthFactorMetaHelper,
  ) {}

  private async getLendingBalances(address: string) {
    return Promise.all([
      this.aaveV2LendingBalanceHelper.getLendingContractPositionBalances({
        address,
        appId: AAVE_V2_DEFINITION.id,
        groupId: AAVE_V2_DEFINITION.groups.supply.id,
        network,
      }),
      this.aaveV2LendingBalanceHelper.getLendingContractPositionBalances({
        address,
        appId: AAVE_V2_DEFINITION.id,
        groupId: AAVE_V2_DEFINITION.groups.stableDebt.id,
        network,
        isDebt: true,
      }),
      this.aaveV2LendingBalanceHelper.getLendingContractPositionBalances({
        address,
        appId: AAVE_V2_DEFINITION.id,
        groupId: AAVE_V2_DEFINITION.groups.variableDebt.id,
        network,
        isDebt: true,
      }),
    ]).then(v => v.flat());
  }

  private async getClaimableBalances(address: string) {
    return this.aaveV2ClaimableBalanceHelper.getClaimableBalances({
      address,
      appId: AAVE_V2_DEFINITION.id,
      groupId: AAVE_V2_DEFINITION.groups.claimable.id,
      network,
    });
  }

  private async getHealthFactorMeta(address: string) {
    return this.healthFactorHelper.getHealthFactor({
      address,
      network,
      lendingPoolAddress: '0x4f01aed16d97e3ab5ab2b501154dc9bb0f1a5a2c',
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
