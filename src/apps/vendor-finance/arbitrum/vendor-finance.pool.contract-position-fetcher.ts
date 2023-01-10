import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { isBorrowed } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { VendorFinanceContractFactory } from '../contracts';
import { VendorFinancePool } from '../contracts/ethers';
import { VENDOR_GRAPH_URL } from '../graphql/constants';
import { borrowerInfosQuery, VendorBorrowerGraphResponse } from '../graphql/getBorrowerInfosQuery';
import { lendingPoolsQuery, VendorLendingPoolsGraphResponse } from '../graphql/getLendingPoolsQuery';

export type VendorFinancePoolDefinition = {
  address: string;
  deployer: string;
  mintRatio: string;
  colToken: string;
  lendToken: string;
  expiry: string;
  feeRate: string;
  lendBalance: string;
  totalBorrowed: string;
};

type VendorFinancePoolDataProps = DefaultDataProps & {
  deployer: string;
  totalDeposited: number;
};

@PositionTemplate()
export class ArbitrumVendorFinancePoolContractPositionFetcher extends ContractPositionTemplatePositionFetcher<VendorFinancePool> {
  groupLabel = 'Lending Pools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VendorFinanceContractFactory) protected readonly contractFactory: VendorFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): VendorFinancePool {
    return this.contractFactory.vendorFinancePool({ address, network: this.network });
  }

  async getDefinitions() {
    const data = await gqlFetch<VendorLendingPoolsGraphResponse>({
      endpoint: VENDOR_GRAPH_URL,
      query: lendingPoolsQuery,
    });

    return (data?.pools ?? []).map(poolData => ({
      address: poolData.id,
      deployer: poolData._deployer,
      mintRatio: poolData._mintRatio,
      colToken: poolData._colToken,
      lendToken: poolData._lendToken,
      expiry: poolData._expiry,
      feeRate: poolData._feeRate,
      lendBalance: poolData._lendBalance,
      totalBorrowed: poolData._totalBorrowed,
    }));
  }

  // returning the lendToken with two different status as it'll either be
  // deposited initially (user = lender) or borrowed (user = borrower).
  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<VendorFinancePool, VendorFinancePoolDefinition>) {
    return [
      { metaType: MetaType.SUPPLIED, address: definition.colToken, network: this.network },
      { metaType: MetaType.BORROWED, address: definition.lendToken, network: this.network },
      { metaType: MetaType.SUPPLIED, address: definition.lendToken, network: this.network },
    ];
  }

  async getLabel({
    contractPosition,
    definition,
  }: GetDisplayPropsParams<VendorFinancePool, DefaultDataProps, VendorFinancePoolDefinition>) {
    const poolLabel = `${getLabelFromToken(contractPosition.tokens[0])}/${getLabelFromToken(
      contractPosition.tokens[1],
    )}`;

    const dateString = new Date(parseInt(definition.expiry) * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${poolLabel} Lending Pool - ${dateString}`;
  }

  async getStatsItems({
    contractPosition,
    definition,
  }: GetDisplayPropsParams<VendorFinancePool, DefaultDataProps, VendorFinancePoolDefinition>) {
    const debtToken = contractPosition.tokens.find(isBorrowed)!;

    return [
      {
        label: 'Lending APR',
        value: buildPercentageDisplayItem(parseInt(definition.feeRate) / 10000),
      },
      {
        label: 'Repayment date',
        value: new Date(parseInt(definition.expiry) * 1000).toDateString(),
      },
      {
        label: 'Available',
        value: buildDollarDisplayItem((parseInt(definition.lendBalance) / 10 ** debtToken.decimals) * debtToken.price),
      },
      {
        label: 'Borrowed',
        value: buildDollarDisplayItem(
          (parseInt(definition.totalBorrowed) / 10 ** debtToken.decimals) * debtToken.price,
        ),
      },
      {
        label: 'Lend ratio',
        value: parseInt(definition.mintRatio) / 10 ** 18,
      },
    ];
  }
  async getDataProps(
    _params: GetDataPropsParams<VendorFinancePool, DefaultDataProps, VendorFinancePoolDefinition>,
  ): Promise<VendorFinancePoolDataProps> {
    return {
      deployer: _params.definition.deployer,
      totalDeposited: parseInt(_params.definition.lendBalance) + parseInt(_params.definition.totalBorrowed),
    };
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
  }: GetTokenBalancesParams<VendorFinancePool, VendorFinancePoolDataProps>) {
    const collateralToken = contractPosition.tokens[0]!;
    const lentToken = contractPosition.tokens[1]!;

    // --- Lender logic ----
    // No deposit, no borrow, but lending out
    if (address === contractPosition.dataProps.deployer.toLowerCase()) {
      return ['0', '0', contractPosition.dataProps.totalDeposited.toString()];
    }
    // --! Lender logic !---

    // --- Borrower logic ----
    const data = await gqlFetch<VendorBorrowerGraphResponse>({
      endpoint: VENDOR_GRAPH_URL,
      query: borrowerInfosQuery(address),
    });

    const borrowerPosition = data.borrower?.positions.find(({ pool }) => pool.id === contractPosition.address);
    if (!borrowerPosition) return [];

    const poolRate = parseInt(borrowerPosition.pool._mintRatio) / 10 ** 18;
    const suppliedBalance = parseInt(borrowerPosition.totalBorrowed) / 10 ** lentToken.decimals / poolRate;
    const suppliedBalanceRaw = suppliedBalance * 10 ** collateralToken.decimals;
    const borrowedBalance = parseInt(borrowerPosition.totalBorrowed);

    // Deposit, borrow, no lending out (not pool creator)
    return [suppliedBalanceRaw.toString(), borrowedBalance.toString(), '0'];
    // --! Borrower logic !---
  }
}
