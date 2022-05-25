import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { CompoundContractFactory } from '~apps/compound';
import { CompoundLendingMetaHelper } from '~apps/compound/helper/compound.lending.meta-helper';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { MarketXyzLendingBalanceHelper } from '../helpers/market-xyz.lending.balance-helper';
import { MARKET_XYZ_DEFINITION } from '../market-xyz.definition';

@Register.BalanceFetcher(MARKET_XYZ_DEFINITION.id, Network.FANTOM_OPERA_MAINNET)
export class FantomMarketXyzBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(CompoundContractFactory)
    private readonly compoundContractFactory: CompoundContractFactory,
    @Inject(MarketXyzLendingBalanceHelper)
    private readonly MarketXyzLendingBalanceHelper: MarketXyzLendingBalanceHelper,
    @Inject(CompoundLendingMetaHelper)
    private readonly compoundLendingMetaHelper: CompoundLendingMetaHelper,
  ) {}

  async getLendingBalances(address: string) {
    return this.MarketXyzLendingBalanceHelper.getBalances({
      address,
      appId: MARKET_XYZ_DEFINITION.id,
      supplyGroupId: MARKET_XYZ_DEFINITION.groups.supply.id,
      borrowGroupId: MARKET_XYZ_DEFINITION.groups.borrow.id,
      network: Network.FANTOM_OPERA_MAINNET,
      fuseLensAddress: '0x5aB6215AB8344C28B899efdE93BEe47B124200Fb',
      getTokenContract: ({ address, network }) => this.compoundContractFactory.compoundCToken({ address, network }),
      getBalanceRaw: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      getBorrowBalanceRaw: ({ contract, address, multicall }) =>
        multicall
          .wrap(contract)
          .borrowBalanceCurrent(address)
          .catch(() => '0'),
    });
  }

  async getBalances(address: string) {
    const [lendingBalances] = await Promise.all([this.getLendingBalances(address)]);

    const meta = this.compoundLendingMetaHelper.getMeta({ balances: lendingBalances });

    return presentBalanceFetcherResponse([
      {
        label: 'Lending',
        assets: lendingBalances,
        meta: meta,
      },
    ]);
  }
}
