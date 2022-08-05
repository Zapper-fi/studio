import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { AaveV2HealthFactorMetaHelper } from '~apps/aave-v2/helpers/aave-v2.health-factor-meta-helper';
import { AaveV2LendingBalanceHelper } from '~apps/aave-v2/helpers/aave-v2.lending.balance-helper';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { GEIST_DEFINITION } from '../geist.definition';
import { GeistIncentivesBalanceHelper } from '../helpers/geist.incentives.balance-helper';
import { GeistPlatformFeesBalanceHelper } from '../helpers/geist.platform-fees.balance-helper';

const network = Network.FANTOM_OPERA_MAINNET;

@Register.BalanceFetcher(GEIST_DEFINITION.id, Network.FANTOM_OPERA_MAINNET)
export class FantomGeistBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(AaveV2LendingBalanceHelper) private readonly aaveV2LendingBalanceHelper: AaveV2LendingBalanceHelper,
    @Inject(AaveV2HealthFactorMetaHelper) private readonly healthFactorHelper: AaveV2HealthFactorMetaHelper,
    @Inject(GeistPlatformFeesBalanceHelper)
    private readonly geistPlatformFeesBalanceHelper: GeistPlatformFeesBalanceHelper,
    @Inject(GeistIncentivesBalanceHelper)
    private readonly geistIncentivesBalanceHelper: GeistIncentivesBalanceHelper,
  ) {}

  private async getLendingBalances(address: string) {
    return Promise.all([
      this.aaveV2LendingBalanceHelper.getLendingContractPositionBalances({
        address,
        appId: GEIST_DEFINITION.id,
        groupId: GEIST_DEFINITION.groups.supply.id,
        network,
      }),
      this.aaveV2LendingBalanceHelper.getLendingContractPositionBalances({
        address,
        appId: GEIST_DEFINITION.id,
        groupId: GEIST_DEFINITION.groups.stableDebt.id,
        network,
        isDebt: true,
      }),
      this.aaveV2LendingBalanceHelper.getLendingContractPositionBalances({
        address,
        appId: GEIST_DEFINITION.id,
        groupId: GEIST_DEFINITION.groups.variableDebt.id,
        network,
        isDebt: true,
      }),
    ]).then(v => v.flat());
  }

  private async getClaimableBalances(address: string) {
    return this.geistIncentivesBalanceHelper.getBalances({
      address,
      network,
    });
  }

  private async getPlatformFeeBalances(address: string) {
    return this.geistPlatformFeesBalanceHelper.getBalances({
      address,
      network,
    });
  }

  private async getHealthFactorMeta(address: string) {
    return this.healthFactorHelper.getHealthFactor({
      address,
      network,
      lendingPoolAddress: '0x9fad24f572045c7869117160a571b2e50b10d068',
    });
  }

  async getBalances(address: string) {
    const [lendingBalances, incentiveBalances, platformFeeBalances, healthFactorMeta] = await Promise.all([
      this.getLendingBalances(address),
      this.getClaimableBalances(address),
      this.getPlatformFeeBalances(address),
      this.getHealthFactorMeta(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Lending',
        assets: lendingBalances,
        meta: lendingBalances.find(v => v.balanceUSD < 0) ? [healthFactorMeta] : [],
      },
      {
        label: 'Incentives',
        assets: incentiveBalances,
      },
      {
        label: 'Platform Fees',
        assets: platformFeeBalances,
      },
    ]);
  }
}
