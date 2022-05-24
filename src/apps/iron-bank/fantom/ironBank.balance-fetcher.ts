import { Inject, forwardRef } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { IRON_BANK_DEFINITION } from '../iron-bank.definition';
import { IronBankContractFactory } from '../contracts';

import { IronBankLendingBalanceHelper } from '../helper/ironBank.lending.balance-helper';
import { IronBankLendingMetaHelper } from '../helper/ironBank.lending.meta-helper';

const appId = IRON_BANK_DEFINITION.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.BalanceFetcher(appId, network)
export class FantomIronBankBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(IronBankLendingBalanceHelper)
    private readonly ironBankLendingBalanceHelper: IronBankLendingBalanceHelper,
    @Inject(IronBankLendingMetaHelper)
    private readonly ironBankLendingMetaHelper: IronBankLendingMetaHelper,
    @Inject(IronBankContractFactory)
    private readonly ironBankContractFactory: IronBankContractFactory,
  ) {}

  async getLendingBalances(address: string) {
    return this.ironBankLendingBalanceHelper.getBalances({
      address,
      appId,
      supplyGroupId: IRON_BANK_DEFINITION.groups.supply.id,
      borrowGroupId: IRON_BANK_DEFINITION.groups.borrow.id,
      network,
      getTokenContract: ({ address, network }) => this.ironBankContractFactory.ironBankCToken({ address, network }),
      getBalanceRaw: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      getBorrowBalanceRaw: ({ contract, address, multicall }) => multicall.wrap(contract).borrowBalanceCurrent(address),
    });
  }

  async getBalances(address: string) {
    const [lendingBalances] = await Promise.all([
      this.getLendingBalances(address)
    ]);

    const meta = this.ironBankLendingMetaHelper.getMeta({ balances: lendingBalances });

    return presentBalanceFetcherResponse([
      {
        label: 'Lending',
        assets: lendingBalances,
        meta: meta,
      }
    ]);
  }
}
