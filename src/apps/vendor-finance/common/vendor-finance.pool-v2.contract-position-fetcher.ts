import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';

import { VendorFinanceContractFactory, VendorFinancePoolV2 } from '../contracts';
import { LENDING_POOLS_V2_QUERY, VendorLendingPoolsV2GraphResponse } from './getLendingPoolsQuery';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { MetaType } from '~position/position.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { VendorBorrowerV2GraphResponse, borrowerV2InfosQuery } from './getBorrowerInfosQuery';
import { isBorrowed } from '~position/position.utils';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';

export type VendorFinancePoolV2Definition = {
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

export abstract class VendorFinancePoolV2ContractPositionFetcher extends ContractPositionTemplatePositionFetcher<VendorFinancePoolV2> {
  abstract subgraphUrl: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VendorFinanceContractFactory) protected readonly contractFactory: VendorFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): VendorFinancePoolV2 {
    return this.contractFactory.vendorFinancePoolV2({ address, network: this.network });
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    const data = await gqlFetch<VendorLendingPoolsV2GraphResponse>({
      endpoint: this.subgraphUrl,
      query: LENDING_POOLS_V2_QUERY,
    });

    return (data?.pools ?? []).map(poolData => ({
      address: poolData.id,
      deployer: poolData.deployer,
      mintRatio: poolData.mintRatio,
      colToken: poolData.colToken,
      lendToken: poolData.lendToken,
      expiry: poolData.expiry,
      feeRate: poolData.startRate,
      lendBalance: poolData.lendBalance,
      totalBorrowed: poolData.totalBorrowed,
    }));
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<VendorFinancePoolV2, VendorFinancePoolV2Definition>) {
    return [
      { metaType: MetaType.SUPPLIED, address: definition.colToken, network: this.network },
      { metaType: MetaType.BORROWED, address: definition.lendToken, network: this.network },
      { metaType: MetaType.SUPPLIED, address: definition.lendToken, network: this.network },
    ];
  }

  async getLabel({
    contractPosition,
    definition,
  }: GetDisplayPropsParams<VendorFinancePoolV2, DefaultDataProps, VendorFinancePoolV2Definition>) {
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
  }: GetDisplayPropsParams<VendorFinancePoolV2, DefaultDataProps, VendorFinancePoolV2Definition>) {
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
    _params: GetDataPropsParams<VendorFinancePoolV2, DefaultDataProps, VendorFinancePoolV2Definition>,
  ): Promise<VendorFinancePoolDataProps> {
    return {
      deployer: _params.definition.deployer,
      totalDeposited: parseInt(_params.definition.lendBalance) + parseInt(_params.definition.totalBorrowed),
    };
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
  }: GetTokenBalancesParams<VendorFinancePoolV2, VendorFinancePoolDataProps>) {
    const collateralToken = contractPosition.tokens[0]!;
    const lentToken = contractPosition.tokens[1]!;

    // --- Lender logic ----
    // No deposit, no borrow, but lending out
    if (address === contractPosition.dataProps.deployer.toLowerCase()) {
      return ['0', '0', contractPosition.dataProps.totalDeposited.toString()];
    }
    // --! Lender logic !---

    // --- Borrower logic ----
    const data = await gqlFetch<VendorBorrowerV2GraphResponse>({
      endpoint: this.subgraphUrl,
      query: borrowerV2InfosQuery(address),
    });

    const borrowerPosition = data.borrower?.positions.find(({ pool }) => pool.id === contractPosition.address);
    if (!borrowerPosition) return [];

    const poolRate = parseInt(borrowerPosition.pool.mintRatio) / 10 ** 18;
    const suppliedBalance = parseInt(borrowerPosition.totalBorrowed) / 10 ** lentToken.decimals / poolRate;
    const suppliedBalanceRaw = suppliedBalance * 10 ** collateralToken.decimals;
    const borrowedBalance = parseInt(borrowerPosition.totalBorrowed);

    // Deposit, borrow, no lending out (not pool creator)
    return [suppliedBalanceRaw.toString(), borrowedBalance.toString(), '0'];
    // --! Borrower logic !---
  }
}
