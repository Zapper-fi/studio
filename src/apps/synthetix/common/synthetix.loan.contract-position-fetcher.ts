import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { BigNumberish } from 'ethers';
import { gql } from 'graphql-request';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { Network } from '~types/network.interface';

import { SynthetixContractFactory, SynthetixLoan } from '../contracts';

export type SynthetixLoanContractPositionHelperParams = {
  loanContractAddress: string;
  network: Network;
};

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

export abstract class SynthetixLoanContractPositionFetcher extends ContractPositionTemplatePositionFetcher<SynthetixLoan> {
  abstract loanAddress: string;
  abstract sUSDAddress: string;
  abstract sETHAddress: string;
  abstract subgraphUrl: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) protected readonly contractFactory: SynthetixContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SynthetixLoan {
    return this.contractFactory.synthetixLoan({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: this.loanAddress }];
  }

  async getTokenDefinitions() {
    return [
      { metaType: MetaType.SUPPLIED, address: ZERO_ADDRESS },
      { metaType: MetaType.BORROWED, address: this.sUSDAddress },
      { metaType: MetaType.BORROWED, address: this.sETHAddress },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<SynthetixLoan>) {
    return `${getLabelFromToken(contractPosition.tokens[0])} Position`;
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
  }: GetTokenBalancesParams<SynthetixLoan, DefaultDataProps>): Promise<BigNumberish[]> {
    const loansFromSubgraph = await this.appToolkit.helpers.theGraphHelper.requestGraph<GetLoans>({
      endpoint: this.subgraphUrl,
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
    const sUSDDebtToken = contractPosition.tokens.find(v => v.symbol === 'sUSD')!;
    const sETHDebtToken = contractPosition.tokens.find(v => v.symbol === 'sETH')!;

    const collateralBalanceRaw = new BigNumber((collateral * 10 ** collateralToken.decimals).toString()).toFixed(0);
    const sUSDdebtBalanceRaw = new BigNumber((sUSDdebt * 10 ** sUSDDebtToken.decimals).toString()).toFixed(0);
    const sETHdebtBalanceRaw = new BigNumber((sETHdebt * 10 ** sETHDebtToken.decimals).toString()).toFixed(0);

    return [collateralBalanceRaw, sUSDdebtBalanceRaw, sETHdebtBalanceRaw];
  }
}
