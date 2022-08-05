import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { AaveV2HealthFactorMetaHelper } from '~apps/aave-v2/helpers/aave-v2.health-factor-meta-helper';
import { AaveV2LendingBalanceHelper } from '~apps/aave-v2/helpers/aave-v2.lending.balance-helper';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { BLIZZ_DEFINITION } from '../blizz.definition';
import { BlizzPlatformFeesBalanceHelper } from '../helpers/blizz.platform-fees.balance-helper';

const network = Network.AVALANCHE_MAINNET;

@Register.BalanceFetcher(BLIZZ_DEFINITION.id, Network.AVALANCHE_MAINNET)
export class AvalancheBlizzBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(AaveV2LendingBalanceHelper) private readonly aaveV2LendingBalanceHelper: AaveV2LendingBalanceHelper,
    @Inject(AaveV2HealthFactorMetaHelper) private readonly healthFactorHelper: AaveV2HealthFactorMetaHelper,
    @Inject(BlizzPlatformFeesBalanceHelper)
    private readonly blizzPlatformFeesBalanceHelper: BlizzPlatformFeesBalanceHelper,
  ) {}

  private async getLendingBalances(address: string) {
    return Promise.all([
      this.aaveV2LendingBalanceHelper.getLendingContractPositionBalances({
        address,
        appId: BLIZZ_DEFINITION.id,
        groupId: BLIZZ_DEFINITION.groups.supply.id,
        network,
      }),
      this.aaveV2LendingBalanceHelper.getLendingContractPositionBalances({
        address,
        appId: BLIZZ_DEFINITION.id,
        groupId: BLIZZ_DEFINITION.groups.stableDebt.id,
        network,
        isDebt: true,
      }),
      this.aaveV2LendingBalanceHelper.getLendingContractPositionBalances({
        address,
        appId: BLIZZ_DEFINITION.id,
        groupId: BLIZZ_DEFINITION.groups.variableDebt.id,
        network,
        isDebt: true,
      }),
    ]).then(v => v.flat());
  }

  private async getClaimableBalances(address: string) {
    return this.blizzPlatformFeesBalanceHelper.getBalances({
      address,
      network,
    });
  }

  private async getHealthFactorMeta(address: string) {
    return this.healthFactorHelper.getHealthFactor({
      address,
      network,
      lendingPoolAddress: '0x70bbe4a294878a14cb3cdd9315f5eb490e346163',
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
