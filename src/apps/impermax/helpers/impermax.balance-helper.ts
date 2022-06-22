import { Inject, Injectable } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { CompoundLendingMetaHelper } from '~apps/compound';
import { CompoundBorrowBalanceHelper } from '~apps/compound/helper/compound.borrow.balance-helper';
import { CompoundSupplyBalanceHelper } from '~apps/compound/helper/compound.supply.balance-helper';

import { ImpermaxContractFactory, Borrowable } from '../contracts';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

@Injectable()
export class ImpermaxBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(CompoundBorrowBalanceHelper)
    private readonly compoundBorrowBalanceHelper: CompoundBorrowBalanceHelper,
    @Inject(CompoundSupplyBalanceHelper)
    private readonly compoundSupplyBalanceHelper: CompoundSupplyBalanceHelper,
    @Inject(CompoundLendingMetaHelper)
    private readonly compoundLendingMetaHelper: CompoundLendingMetaHelper,
    @Inject(ImpermaxContractFactory)
    private readonly contractFactory: ImpermaxContractFactory,
  ) {}

  private async getCollateralBalances({ network, address }) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: IMPERMAX_DEFINITION.id,
      groupId: IMPERMAX_DEFINITION.groups.collateral.id,
      address,
    });
  }

  private async getBorrowBalances({ network, address }) {
    return this.compoundBorrowBalanceHelper.getBalances<Borrowable>({
      address,
      network,
      appId: IMPERMAX_DEFINITION.id,
      groupId: IMPERMAX_DEFINITION.groups.borrow.id,
      getTokenContract: ({ address, network }) => this.contractFactory.borrowable({ address, network }),
      getBorrowBalanceRaw: ({ address, multicall, contract }) => multicall.wrap(contract).borrowBalance(address),
    });
  }

  private async getSupplyBalances({ network, address }) {
    return this.compoundSupplyBalanceHelper.getBalances<Borrowable>({
      address,
      network,
      appId: IMPERMAX_DEFINITION.id,
      groupId: IMPERMAX_DEFINITION.groups.lend.id,
      getTokenContract: ({ address, network }) => this.contractFactory.borrowable({ address, network }),
      getBalanceRaw: ({ address, multicall, contract }) => multicall.wrap(contract).balanceOf(address),
    });
  }

  async getBalances({ network, address }) {
    const [borrowBalances, supplyBalances, collateralBalances] = await Promise.all([
      this.getBorrowBalances({ address, network }),
      this.getSupplyBalances({ address, network }),
      this.getCollateralBalances({ address, network }),
    ]);

    const products = [
      { label: 'Collateral', assets: collateralBalances },
      { label: 'Borrow', assets: borrowBalances },
      { label: 'Supply', assets: supplyBalances },
    ];
    const meta = this.compoundLendingMetaHelper.getMeta({ balances: [...supplyBalances, ...borrowBalances] });

    return presentBalanceFetcherResponse(products, meta);
  }
}
