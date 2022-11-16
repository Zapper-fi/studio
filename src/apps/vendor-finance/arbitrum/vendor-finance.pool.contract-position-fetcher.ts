import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
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
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { Network } from '~types/network.interface';

import { VendorFinanceContractFactory } from '../contracts';
import { VendorFinancePool } from '../contracts/ethers';
import { VENDOR_GRAPH_URL } from '../graphql/constants';
import { borrowerInfosQuery, VendorBorrowerGraphResponse } from '../graphql/getBorrowerInfosQuery';
import { lendingPoolsQuery, VendorLendingPoolsGraphResponse } from '../graphql/getLendingPoolsQuery';
import { VENDOR_FINANCE_DEFINITION } from '../vendor-finance.definition';

const appId = VENDOR_FINANCE_DEFINITION.id;
const groupId = VENDOR_FINANCE_DEFINITION.groups.pools.id;
const network = Network.ARBITRUM_MAINNET;

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
@Register.ContractPositionFetcher({ appId, groupId, network })
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
    const data = await this.appToolkit.helpers.theGraphHelper.requestGraph<VendorLendingPoolsGraphResponse>({
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

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<VendorFinancePool, VendorFinancePoolDefinition>) {
    return [
      { metaType: MetaType.SUPPLIED, address: definition.colToken, network: this.network },
      { metaType: MetaType.BORROWED, address: definition.lendToken, network: this.network },
    ];
  }

  async getLabel({
    contractPosition,
    definition,
  }: GetDisplayPropsParams<VendorFinancePool, DefaultDataProps, VendorFinancePoolDefinition>) {
    const poolLabel = contractPosition.tokens.map(v => getLabelFromToken(v)).join(' / ');

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

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
  }: GetTokenBalancesParams<VendorFinancePool, DefaultDataProps>) {
    const collateralToken = contractPosition.tokens[0]!;
    const lentToken = contractPosition.tokens[1]!;

    const data = await this.appToolkit.helpers.theGraphHelper.requestGraph<VendorBorrowerGraphResponse>({
      endpoint: VENDOR_GRAPH_URL,
      query: borrowerInfosQuery(address),
    });

    const borrowerPosition = data.borrower?.positions.find(({ pool }) => pool.id === contractPosition.address);
    if (!borrowerPosition) return [];

    const poolRate = parseInt(borrowerPosition.pool._mintRatio) / 10 ** 18;
    const suppliedBalance = parseInt(borrowerPosition.totalBorrowed) / 10 ** lentToken.decimals / poolRate;
    const suppliedBalanceRaw = suppliedBalance * 10 ** collateralToken.decimals;
    const borrowedBalance = parseInt(borrowerPosition.totalBorrowed);

    return [suppliedBalanceRaw.toString(), borrowedBalance.toString()];
  }
}
