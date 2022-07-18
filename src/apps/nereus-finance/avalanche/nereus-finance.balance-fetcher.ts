import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { NereusFinanceClaimableBalanceHelper } from '../helpers/nereus-finance.claimable.balance-helper';
import { NereusFinanceHealthFactorMetaHelper } from '../helpers/nereus-finance.health-factor-meta-helper';
import { NereusFinanceLendingBalanceHelper } from '../helpers/nereus-finance.lending.balance-helper';
import { NEREUS_FINANCE_DEFINITION } from '../nereus-finance.definition';

const network = Network.AVALANCHE_MAINNET;

@Register.BalanceFetcher(NEREUS_FINANCE_DEFINITION.id, network)
export class AvalancheNereusFinanceBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(NereusFinanceLendingBalanceHelper)
    private readonly nereusFinanceLendingBalanceHelper: NereusFinanceLendingBalanceHelper,
    @Inject(NereusFinanceClaimableBalanceHelper)
    private readonly nereusFinanceClaimableBalanceHelper: NereusFinanceClaimableBalanceHelper,
    @Inject(NereusFinanceHealthFactorMetaHelper)
    private readonly healthFactorHelper: NereusFinanceHealthFactorMetaHelper,
  ) {}

  private async getLendingBalances(address: string) {
    return Promise.all([
      this.nereusFinanceLendingBalanceHelper.getLendingContractPositionBalances({
        address,
        appId: NEREUS_FINANCE_DEFINITION.id,
        groupId: NEREUS_FINANCE_DEFINITION.groups.supply.id,
        network,
      }),
      this.nereusFinanceLendingBalanceHelper.getLendingContractPositionBalances({
        address,
        appId: NEREUS_FINANCE_DEFINITION.id,
        groupId: NEREUS_FINANCE_DEFINITION.groups.stableDebt.id,
        network,
        isDebt: true,
      }),
      this.nereusFinanceLendingBalanceHelper.getLendingContractPositionBalances({
        address,
        appId: NEREUS_FINANCE_DEFINITION.id,
        groupId: NEREUS_FINANCE_DEFINITION.groups.variableDebt.id,
        network,
        isDebt: true,
      }),
    ]).then(v => v.flat());
  }

  private async getClaimableBalances(address: string) {
    return this.nereusFinanceClaimableBalanceHelper.getClaimableBalances({
      address,
      appId: NEREUS_FINANCE_DEFINITION.id,
      groupId: NEREUS_FINANCE_DEFINITION.groups.claimable.id,
      network,
    });
  }

  private async getHealthFactorMeta(address: string) {
    return this.healthFactorHelper.getHealthFactor({
      address,
      network,
      lendingPoolAddress: '0xB9257597EDdfA0eCaff04FF216939FBc31AAC026',
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
