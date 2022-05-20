import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { CompoundLendingBalanceHelper } from '../../tarot/helper/compound.lending.balance-helper';
import { ImpermaxContractFactory, Borrowable } from '../contracts';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(IMPERMAX_DEFINITION.id, network)
export class EthereumImpermaxBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(CompoundLendingBalanceHelper)
    private readonly compoundLendingBalanceHelper: CompoundLendingBalanceHelper,
    @Inject(ImpermaxContractFactory)
    private readonly contractFactory: ImpermaxContractFactory,
  ) {}

  private async getCollateralTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      network,
      appId: IMPERMAX_DEFINITION.id,
      groupId: IMPERMAX_DEFINITION.groups.collateral.id,
      address,
    });
  }

  private async getLendingTokenBalances(address: string) {
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

  async getBalances(address: string) {
    const lendingBalance = await this.getLendingTokenBalances(address);
    const collateralBalance = await this.getCollateralTokenBalances(address);

    // TODO: add impermax rewards

    return presentBalanceFetcherResponse([
      {
        label: 'Lending Pools',
        assets: [...lendingBalance, ...collateralBalance],
      },
    ]);
  }
}
