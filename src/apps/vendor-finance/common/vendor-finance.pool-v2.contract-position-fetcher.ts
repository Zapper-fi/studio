import { Inject } from '@nestjs/common';
import Axios from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
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
  GetDefinitionsParams,
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';

import { VendorFinanceContractFactory, VendorFinancePoolV2 } from '../contracts';
import { IPositionTracker } from '../contracts/ethers/VendorFinancePositionTracker';

import { LENDING_POOLS_V2_QUERY } from './getLendingPoolsQuery';
import {
  VendorFinancePoolDataProps,
  VendorFinancePoolV2Definition,
  VendorLendingPoolsV2GraphResponse,
} from './vendor-finance.pool.types';

export abstract class VendorFinancePoolV2ContractPositionFetcher extends ContractPositionTemplatePositionFetcher<VendorFinancePoolV2> {
  abstract entityUrl: string;
  abstract positionTrackerAddr: string;

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
    const data: VendorLendingPoolsV2GraphResponse = await Axios.post(this.entityUrl, {
      query: LENDING_POOLS_V2_QUERY,
      type: `v2-${this.network.charAt(0).toUpperCase() + this.network.slice(1)}`,
    });
    return (data.data?.pools ?? []).map(poolData => ({
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
    const startKey = '0x'.padEnd(66, '0');
    const multicall = this.appToolkit.getMulticall(this.network);
    const positionTracker = multicall.wrap(
      this.contractFactory.vendorFinancePositionTracker({
        address: this.positionTrackerAddr,
        network: this.network,
      }),
    );
    const borrowerPositionCount = await positionTracker.borrowPositionCount(address);
    const borrowerPositions = await positionTracker.getBorrowPositions(address, startKey, borrowerPositionCount);
    const borrowerPosition = borrowerPositions.find(
      poolData => contractPosition.address.toLowerCase() === poolData.pool.toLowerCase(),
    );
    if (!borrowerPosition) return [];
    const totalBorrowed = await this.getTotalBorrowed(borrowerPositions, address);
    const poolSettings = await this.getPoolSettings(contractPosition.address);
    const poolRate = Number(poolSettings.lendRatio) / 10 ** 18;
    const suppliedBalance = totalBorrowed / 10 ** lentToken.decimals / poolRate;
    const suppliedBalanceRaw = suppliedBalance * 10 ** collateralToken.decimals;
    // Deposit, borrow, no lending out (not pool creator)
    return [suppliedBalanceRaw.toString(), totalBorrowed.toString(), '0'];
    // --! Borrower logic !---
  }

  async getPoolSettings(address: string) {
    const pool = this.contractFactory.vendorFinancePoolV2({ address, network: this.network });
    return await pool.poolSettings();
  }

  async getTotalBorrowed(positions: IPositionTracker.EntryStructOutput[], borrowerAddr: string): Promise<number> {
    let totalBorrowed = 0;
    await Promise.all(
      positions.map(async poolData => {
        const lendingPool = this.contractFactory.vendorFinancePoolV2({
          address: poolData.pool,
          network: this.network,
        });
        const borrowedFromPoolAmt = Number((await lendingPool.debts(borrowerAddr)).debt.toString());
        totalBorrowed += borrowedFromPoolAmt;
      }),
    );
    return totalBorrowed;
  }
}
