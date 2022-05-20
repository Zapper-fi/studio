import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { TarotBorrowable, TarotContractFactory } from '../contracts';
import { CompoundLendingBalanceHelper } from '../helper/compound.lending.balance-helper';
import { TAROT_DEFINITION } from '../tarot.definition';

@Register.BalanceFetcher(TAROT_DEFINITION.id, Network.FANTOM_OPERA_MAINNET)
export class FantomTarotBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(CompoundLendingBalanceHelper)
    private readonly compoundLendingBalanceHelper: CompoundLendingBalanceHelper,
    @Inject(TarotContractFactory)
    private readonly contractFactory: TarotContractFactory,
  ) {}

  async getBalances(address: string) {
    const [supplyVaults, collateralTokenBalances, lendingTokenBalances] = await Promise.all([
      this.getSupplyVaultBalances(address),
      this.getCollateralTokenBalances(address),
      this.getLendingTokenBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Vaults',
        assets: supplyVaults,
      },
      {
        label: 'Lending Pools',
        assets: [...collateralTokenBalances, ...lendingTokenBalances],
      },
    ]);
  }

  private async getSupplyVaultBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network: Network.FANTOM_OPERA_MAINNET,
      appId: TAROT_DEFINITION.id,
      groupId: TAROT_DEFINITION.groups.supplyVault.id,
      address,
    });
  }

  private async getCollateralTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network: Network.FANTOM_OPERA_MAINNET,
      appId: TAROT_DEFINITION.id,
      groupId: TAROT_DEFINITION.groups.collateral.id,
      address,
    });
  }

  private async getLendingTokenBalances(address: string) {
    return await this.compoundLendingBalanceHelper.getBalances<TarotBorrowable>({
      address,
      network: Network.FANTOM_OPERA_MAINNET,
      appId: TAROT_DEFINITION.id,
      supplyGroupId: TAROT_DEFINITION.groups.supply.id,
      borrowGroupId: TAROT_DEFINITION.groups.borrow.id,
      getTokenContract: ({ address, network }) => this.contractFactory.tarotBorrowable({ address, network }),
      getBalanceRaw: ({ address, multicall, contract }) => multicall.wrap(contract).balanceOf(address),
      getBorrowBalanceRaw: ({ address, multicall, contract }) => multicall.wrap(contract).borrowBalance(address),
    });
  }
}
