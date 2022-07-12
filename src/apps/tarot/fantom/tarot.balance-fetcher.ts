import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { CompoundBorrowBalanceHelper } from '~apps/compound/helper/compound.borrow.balance-helper';
import { CompoundLendingMetaHelper } from '~apps/compound/helper/compound.lending.meta-helper';
import { CompoundSupplyBalanceHelper } from '~apps/compound/helper/compound.supply.balance-helper';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { TarotBorrowable, TarotContractFactory } from '../contracts';
import { TAROT_DEFINITION } from '../tarot.definition';

const network = Network.FANTOM_OPERA_MAINNET;

@Register.BalanceFetcher(TAROT_DEFINITION.id, network)
export class FantomTarotBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TarotContractFactory) private readonly contractFactory: TarotContractFactory,
    @Inject(CompoundSupplyBalanceHelper) private readonly compoundSupplyBalanceHelper: CompoundSupplyBalanceHelper,
    @Inject(CompoundLendingMetaHelper) private readonly compoundLendingMetaHelper: CompoundLendingMetaHelper,
    @Inject(CompoundBorrowBalanceHelper) private readonly compoundBorrowBalanceHelper: CompoundBorrowBalanceHelper,
  ) {}

  async getSupplyBalances(address: string) {
    return this.compoundSupplyBalanceHelper.getBalances({
      address,
      appId: TAROT_DEFINITION.id,
      groupId: TAROT_DEFINITION.groups.supply.id,
      network,
      getTokenContract: ({ address, network }) => this.contractFactory.compoundCToken({ address, network }),
      getBalanceRaw: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
    });
  }

  async getBorrowBalances(address: string) {
    return this.compoundBorrowBalanceHelper.getBalances<TarotBorrowable>({
      address,
      appId: TAROT_DEFINITION.id,
      groupId: TAROT_DEFINITION.groups.borrow.id,
      network,
      getTokenContract: ({ address, network }) => this.contractFactory.tarotBorrowable({ address, network }),
      getBorrowBalanceRaw: ({ contract, address, multicall }) => multicall.wrap(contract).borrowBalance(address),
    });
  }

  private async getVaultBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: TAROT_DEFINITION.id,
      groupId: TAROT_DEFINITION.groups.vault.id,
      address,
    });
  }

  async getBalances(address: string) {
    const [supplyBalances, borrowBalances, vaultBalances] = await Promise.all([
      this.getSupplyBalances(address),
      this.getBorrowBalances(address),
      this.getVaultBalances(address),
    ]);

    const meta = this.compoundLendingMetaHelper.getMeta({ balances: [...supplyBalances, ...borrowBalances] });

    return presentBalanceFetcherResponse([
      {
        label: 'Lending',
        assets: [...supplyBalances, ...borrowBalances],
        meta,
      },
      {
        label: 'Vaults',
        assets: vaultBalances,
      },
    ]);
  }
}
