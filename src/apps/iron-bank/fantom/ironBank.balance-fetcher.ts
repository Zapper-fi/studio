import { Inject, forwardRef } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { IRON_BANK_DEFINITION } from '../iron-bank.definition';
import { IronBankContractFactory } from '../contracts';

import { CompoundLendingMetaHelper } from '~apps/compound/helper/compound.lending.meta-helper';
import { CompoundSupplyBalanceHelper } from '~apps/compound/helper/compound.supply.balance-helper';
import { CompoundBorrowBalanceHelper } from '~apps/compound/helper/compound.borrow.balance-helper';

const appId = IRON_BANK_DEFINITION.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.BalanceFetcher(appId, network)
export class FantomIronBankBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(CompoundBorrowBalanceHelper)
    private readonly compoundBorrowBalanceHelper: CompoundBorrowBalanceHelper,
    @Inject(CompoundLendingMetaHelper)
    private readonly compoundLendingMetaHelper: CompoundLendingMetaHelper,
    @Inject(CompoundSupplyBalanceHelper)
    private readonly compoundSupplyBalanceHelper: CompoundSupplyBalanceHelper,
    @Inject(IronBankContractFactory)
    private readonly ironBankContractFactory: IronBankContractFactory,
  ) {}
  async getSupplyBalances(address: string) {
    return this.compoundSupplyBalanceHelper.getBalances({
      address,
      appId,
      groupId: IRON_BANK_DEFINITION.groups.supply.id,
      network,
      getTokenContract: ({ address, network }) => this.ironBankContractFactory.ironBankCToken({ address, network }),
      getBalanceRaw: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
    });
  }

  async getBorrowBalances(address: string) {
    return this.compoundBorrowBalanceHelper.getBalances({
      address,
      appId,
      groupId: IRON_BANK_DEFINITION.groups.borrow.id,
      network,
      getTokenContract: ({ address, network }) => this.ironBankContractFactory.ironBankCToken({ address, network }),
      getBorrowBalanceRaw: ({ contract, address, multicall }) => multicall.wrap(contract).borrowBalanceCurrent(address),
    });
  }

  async getBalances(address: string) {
    const [supplyBalances, borrowBalances] = await Promise.all([
      this.getSupplyBalances(address),
      this.getBorrowBalances(address)
    ]);

    const meta = this.compoundLendingMetaHelper.getMeta({ balances: [...supplyBalances, ...borrowBalances] });
    const lendingProduct = { label: 'Lending', assets: [...supplyBalances, ...borrowBalances], meta };

    return presentBalanceFetcherResponse([lendingProduct]);
}
}
