import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { CoslendContractFactory } from '../contracts';
import { COSLEND_DEFINITION } from '../coslend.definition';
import { CoslendBorrowBalanceHelper } from '../helper/coslend.borrow.balance-helper';
import { CoslendLendingMetaHelper } from '../helper/coslend.lending.meta-helper';
import { CoslendSupplyBalanceHelper } from '../helper/coslend.supply.balance-helper';

const appId = COSLEND_DEFINITION.id;
const network = Network.EVMOS_MAINNET;

@Register.BalanceFetcher(appId, network)
export class EvmosCoslendBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(CoslendBorrowBalanceHelper)
    private readonly coslendBorrowBalanceHelper: CoslendBorrowBalanceHelper,
    @Inject(CoslendSupplyBalanceHelper)
    private readonly coslendSupplyBalanceHelper: CoslendSupplyBalanceHelper,
    @Inject(CoslendLendingMetaHelper)
    private readonly coslendLendingMetaHelper: CoslendLendingMetaHelper,
    @Inject(CoslendContractFactory)
    private readonly coslendContractFactory: CoslendContractFactory,
  ) {}

  async getSupplyBalances(address: string) {
    return this.coslendSupplyBalanceHelper.getBalances({
      address,
      appId,
      groupId: COSLEND_DEFINITION.groups.supply.id,
      network,
      getTokenContract: ({ address, network }) => this.coslendContractFactory.coslendCToken({ address, network }),
      getBalanceRaw: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
    });
  }

  async getBorrowBalances(address: string) {
    return this.coslendBorrowBalanceHelper.getBalances({
      address,
      appId,
      groupId: COSLEND_DEFINITION.groups.borrow.id,
      network,
      getTokenContract: ({ address, network }) => this.coslendContractFactory.coslendCToken({ address, network }),
      getBorrowBalanceRaw: ({ contract, address, multicall }) => multicall.wrap(contract).borrowBalanceCurrent(address),
    });
  }

  async getBalances(address: string) {
    const [supplyBalances, borrowBalances] = await Promise.all([
      this.getSupplyBalances(address),
      this.getBorrowBalances(address),
    ]);

    const meta = this.coslendLendingMetaHelper.getMeta({ balances: [...supplyBalances, ...borrowBalances] });
    const lendingProduct = { label: 'Lending', assets: [...supplyBalances, ...borrowBalances], meta };

    return presentBalanceFetcherResponse([lendingProduct]);
  }
}
