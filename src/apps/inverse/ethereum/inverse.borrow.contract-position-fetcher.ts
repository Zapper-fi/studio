import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  CompoundBorrowContractPositionFetcher,
  CompoundBorrowTokenDataProps,
  GetMarketsParams,
} from '~apps/compound/common/compound.borrow.contract-position-fetcher';
import { isMulticallUnderlyingError } from '~multicall/impl/multicall.ethers';
import { GetDataPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';

import { InverseViemContractFactory } from '../contracts';
import { InverseController, InverseLendingPool } from '../contracts/viem';

@PositionTemplate()
export class EthereumInverseBorrowContractPositionFetcher extends CompoundBorrowContractPositionFetcher<
  InverseLendingPool,
  InverseController
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0x4dcf7407ae5c07f8681e1659f626e114a7667339';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(InverseViemContractFactory) protected readonly contractFactory: InverseViemContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string): InverseLendingPool {
    return this.contractFactory.inverseLendingPool({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string): InverseController {
    return this.contractFactory.inverseController({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<InverseController>) {
    return contract.getAllMarkets();
  }

  async getUnderlyingAddress({ contract }: GetTokenDefinitionsParams<InverseLendingPool>) {
    return contract.underlying().catch(() => ZERO_ADDRESS);
  }

  async getExchangeRate({ contract }: GetDataPropsParams<InverseLendingPool, CompoundBorrowTokenDataProps>) {
    return contract.exchangeRateCurrent();
  }

  async getExchangeRateMantissa({
    contract,
    contractPosition,
  }: GetDataPropsParams<InverseLendingPool, CompoundBorrowTokenDataProps>) {
    const decimals = await contract.read.decimals();
    return 18 + contractPosition.tokens[0].decimals - decimals;
  }

  async getBorrowRate({ contract }: GetDataPropsParams<InverseLendingPool, CompoundBorrowTokenDataProps>) {
    return contract.borrowRatePerBlock().catch(() => 0);
  }

  async getCash({ contract }: GetDataPropsParams<InverseLendingPool, CompoundBorrowTokenDataProps>) {
    return contract.getCash();
  }

  async getCTokenSupply({ contract }: GetDataPropsParams<InverseLendingPool, CompoundBorrowTokenDataProps>) {
    return contract.totalSupply();
  }

  async getCTokenDecimals({ contract }: GetDataPropsParams<InverseLendingPool, CompoundBorrowTokenDataProps>) {
    return contract.decimals();
  }

  async getBorrowBalance({
    contract,
    address,
  }: {
    address: string;
    contract: InverseLendingPool;
  }): Promise<BigNumberish> {
    return contract.borrowBalanceCurrent(address).catch(err => {
      if (isMulticallUnderlyingError(err)) return 0;
      throw err;
    });
  }
}
