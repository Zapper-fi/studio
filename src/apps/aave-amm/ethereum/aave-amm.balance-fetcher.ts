import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { AaveV2HealthFactorMetaHelper } from '~apps/aave-v2/helpers/aave-v2.health-factor-meta-helper';
import { AaveV2LendingBalanceHelper } from '~apps/aave-v2/helpers/aave-v2.lending.balance-helper';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { AAVE_AMM_DEFINITION } from '../aave-amm.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(AAVE_AMM_DEFINITION.id, Network.ETHEREUM_MAINNET)
export class EthereumAaveAmmBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(AaveV2LendingBalanceHelper) private readonly aaveV2LendingBalanceHelper: AaveV2LendingBalanceHelper,
    @Inject(AaveV2HealthFactorMetaHelper) private readonly healthFactorHelper: AaveV2HealthFactorMetaHelper,
  ) {}

  private async getLendingBalances(address: string) {
    return Promise.all([
      this.aaveV2LendingBalanceHelper.getLendingContractPositionBalances({
        address,
        appId: AAVE_AMM_DEFINITION.id,
        groupId: AAVE_AMM_DEFINITION.groups.supply.id,
        network,
      }),
      this.aaveV2LendingBalanceHelper.getLendingContractPositionBalances({
        address,
        appId: AAVE_AMM_DEFINITION.id,
        groupId: AAVE_AMM_DEFINITION.groups.stableDebt.id,
        network,
        isDebt: true,
      }),
      this.aaveV2LendingBalanceHelper.getLendingContractPositionBalances({
        address,
        appId: AAVE_AMM_DEFINITION.id,
        groupId: AAVE_AMM_DEFINITION.groups.variableDebt.id,
        network,
        isDebt: true,
      }),
    ]).then(v => v.flat());
  }

  private async getHealthFactorMeta(address: string) {
    return this.healthFactorHelper.getHealthFactor({
      address,
      network,
      lendingPoolAddress: '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9',
    });
  }

  async getBalances(address: string) {
    const [lendingBalances, healthFactorMeta] = await Promise.all([
      this.getLendingBalances(address),
      this.getHealthFactorMeta(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Lending',
        assets: lendingBalances,
        meta: lendingBalances.find(v => v.balanceUSD < 0) ? [healthFactorMeta] : [],
      },
    ]);
  }
}
