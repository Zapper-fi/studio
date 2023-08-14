import { Inject } from '@nestjs/common';
import Axios from 'axios';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
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

import { VendorFinanceContractFactory, VendorFinancePool } from '../contracts';

import { LENDING_POOLS_QUERY } from './getLendingPoolsQuery';
import {
  VendorFinancePoolDataProps,
  VendorFinancePoolDefinition,
  VendorLendingPoolsGraphResponse,
} from './vendor-finance.pool.types';

export abstract class VendorFinancePoolContractPositionFetcher extends ContractPositionTemplatePositionFetcher<VendorFinancePool> {
  abstract entityUrl: string;

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
    const data: VendorLendingPoolsGraphResponse = await Axios.post(this.entityUrl, {
      query: LENDING_POOLS_QUERY,
      type: `v1-${this.network.charAt(0).toUpperCase() + this.network.slice(1)}`,
    });
    return (data.data?.pools ?? []).map(poolData => ({
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
  async getDataProps({
    definition,
  }: GetDataPropsParams<
    VendorFinancePool,
    DefaultDataProps,
    VendorFinancePoolDefinition
  >): Promise<VendorFinancePoolDataProps> {
    return {
      deployer: definition.deployer,
      totalDeposited: parseInt(definition.lendBalance) + parseInt(definition.totalBorrowed),
    };
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
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
    const [borrowPosition, mintRatioRaw] = await Promise.all([contract.debt(address), contract.mintRatio()]);

    const poolRate = Number(mintRatioRaw) / 10 ** 18;
    const suppliedBalance = Number(borrowPosition.borrowAmount) / 10 ** lentToken.decimals / poolRate;
    const suppliedBalanceRaw = suppliedBalance * 10 ** collateralToken.decimals;
    const borrowedBalance = Number(borrowPosition.borrowAmount);

    // Deposit, borrow, no lending out (not pool creator)
    return [suppliedBalanceRaw.toString(), borrowedBalance.toString(), '0'];
    // --! Borrower logic !---
  }
}
