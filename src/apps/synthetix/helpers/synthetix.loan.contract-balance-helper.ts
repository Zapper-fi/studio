import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { gql } from 'graphql-request';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

type GetLoans = {
  loans: {
    amount: string;
    collateralAmount: string;
    currency: string;
  }[];
};

const getLoanQuery = gql`
  query getLoans($address: String!) {
    loans(where: { account: $address, isOpen: true }) {
      amount
      collateralAmount
      currency
    }
  }
`;

export type SynthetixLoanContractBalanceHelperParams = {
  address: string;
  network: Network;
  endpoint: string;
};

export class SynthetixLoanContractBalanceHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBalances({ address, network, endpoint }: SynthetixLoanContractBalanceHelperParams) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: SYNTHETIX_DEFINITION.id,
      groupId: SYNTHETIX_DEFINITION.groups.loan.id,
      network,
      resolveBalances: async ({ contractPosition }) => {
        const loansFromSubgraph = await this.appToolkit.helpers.theGraphHelper.requestGraph<GetLoans>({
          endpoint: endpoint,
          query: getLoanQuery,
          variables: { address: address },
        });

        let collateral = 0;
        let sUSDdebt = 0;
        let sETHdebt = 0;

        for (const loan of loansFromSubgraph.loans) {
          collateral += Number(loan.collateralAmount);
          if (loan.currency === 'sUSD') {
            sUSDdebt += Number(loan.amount);
          } else {
            sETHdebt += Number(loan.amount);
          }
        }

        const collateralToken = contractPosition.tokens.find(isSupplied)!;
        const sUSDdebtToken = contractPosition.tokens.find(v => v.symbol === 'sUSD')!;
        const sETHdebtToken = contractPosition.tokens.find(v => v.symbol === 'sETH')!;

        const collateralBalanceRaw = new BigNumber((collateral * 10 ** collateralToken.decimals).toString()).toFixed(0);
        const sUSDdebtBalanceRaw = new BigNumber((sUSDdebt * 10 ** sUSDdebtToken.decimals).toString()).toFixed(0);
        const sETHdebtBalanceRaw = new BigNumber((sETHdebt * 10 ** sETHdebtToken.decimals).toString()).toFixed(0);

        const collateralBalance = drillBalance(collateralToken, collateralBalanceRaw);
        const sUSDdebtBalance = drillBalance(sUSDdebtToken, sUSDdebtBalanceRaw);
        const sETHdebtBalance = drillBalance(sETHdebtToken, sETHdebtBalanceRaw);

        const tokens = [collateralBalance, sUSDdebtBalance, sETHdebtBalance];
        return tokens;
      },
    });
  }
}
