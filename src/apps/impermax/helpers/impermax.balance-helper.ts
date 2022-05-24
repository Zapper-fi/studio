import { Inject, Injectable } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';

import { CompoundLendingBalanceHelper } from '../../compound/helper/compound.lending.balance-helper';
import { ImpermaxContractFactory, Borrowable } from '../contracts';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

@Injectable()
export class ImpermaxBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(CompoundLendingBalanceHelper)
    private readonly compoundLendingBalanceHelper: CompoundLendingBalanceHelper,
    @Inject(ImpermaxContractFactory)
    private readonly contractFactory: ImpermaxContractFactory,
  ) {}

  private async getCollateralTokenBalances({ network, address }) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: IMPERMAX_DEFINITION.id,
      groupId: IMPERMAX_DEFINITION.groups.collateral.id,
      address,
    });
  }

  private async getLendingTokenBalances({ network, address }) {
    return await this.compoundLendingBalanceHelper.getBalances<Borrowable>({
      address,
      network,
      appId: IMPERMAX_DEFINITION.id,
      supplyGroupId: IMPERMAX_DEFINITION.groups.lend.id,
      borrowGroupId: IMPERMAX_DEFINITION.groups.borrow.id,
      getTokenContract: ({ address, network }) => this.contractFactory.borrowable({ address, network }),
      getBalanceRaw: ({ address, multicall, contract }) => multicall.wrap(contract).balanceOf(address),
      getBorrowBalanceRaw: ({ address, multicall, contract }) => multicall.wrap(contract).borrowBalance(address),
    });
  }

  async getBalances({ network, address }) {
    const lendingBalance = await this.getLendingTokenBalances({ network, address });
    const collateralBalance = await this.getCollateralTokenBalances({ network, address });

    // TODO: add impermax rewards

    return presentBalanceFetcherResponse([
      {
        label: 'Lending Pools',
        assets: [...lendingBalance, ...collateralBalance],
      },
    ]);
  }
}
