import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { borrowed, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { VENDOR_GRAPH_URL } from '../graphql/constants';
import { borrowerInfosQuery, VendorBorrowerGraphResponse } from '../graphql/getBorrowerInfosQuery';
import { VENDOR_FINANCE_DEFINITION } from '../vendor-finance.definition';

const network = Network.ARBITRUM_MAINNET;

@Register.BalanceFetcher(VENDOR_FINANCE_DEFINITION.id, network)
export class ArbitrumVendorFinanceBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  getVendorPoolsBalances = async (address: string) => {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      network,
      appId: VENDOR_FINANCE_DEFINITION.id,
      groupId: VENDOR_FINANCE_DEFINITION.groups.pools.id,
      resolveBalances: async ({ address, contractPosition }) => {
        const collateralToken = contractPosition.tokens[0]!;
        const lentToken = contractPosition.tokens[1]!;

        if (address === contractPosition.dataProps.deployer) {
          const totalDeposited = contractPosition.dataProps.totalDeposited as number;
          return [drillBalance(supplied(lentToken), totalDeposited.toString())];
        }
        const graphHelper = this.appToolkit.helpers.theGraphHelper;
        const data = await graphHelper.requestGraph<VendorBorrowerGraphResponse>({
          endpoint: VENDOR_GRAPH_URL,
          query: borrowerInfosQuery(address),
        });

        if (!data.borrower) return [];
        const borrowerPosition = data.borrower.positions.find(({ pool }) => pool.id === contractPosition.address);

        if (!borrowerPosition) return [];

        const poolRate = parseInt(borrowerPosition.pool._mintRatio) / 10 ** 18;

        const suppliedBalance =
          (parseInt(borrowerPosition.totalBorrowed) / 10 ** lentToken.decimals / poolRate) *
          10 ** collateralToken.decimals;
        const borrowedBalance = parseInt(borrowerPosition.totalBorrowed);
        const balances = [
          drillBalance(supplied(collateralToken), suppliedBalance.toString()),
          drillBalance(borrowed(lentToken), borrowedBalance.toString(), { isDebt: true }),
        ];

        return balances;
      },
    });
  };

  async getBalances(address: string) {
    const lendingPoolsBalances = await this.getVendorPoolsBalances(address);

    return presentBalanceFetcherResponse([
      {
        label: 'Lending pools',
        assets: lendingPoolsBalances,
      },
    ]);
  }
}
