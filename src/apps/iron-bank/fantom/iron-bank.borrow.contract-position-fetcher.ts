import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  CompoundBorrowContractPositionFetcher,
  CompoundBorrowTokenDataProps,
  GetMarketsParams,
} from '~apps/compound/common/compound.borrow.contract-position-fetcher';
import {
  GetDataPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { IronBankViemContractFactory } from '../contracts';
import { IronBankComptroller, IronBankCToken } from '../contracts/viem';

@PositionTemplate()
export class FantomIronBankBorrowContractPositionFetcher extends CompoundBorrowContractPositionFetcher<
  IronBankCToken,
  IronBankComptroller
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0x4250a6d3bd57455d7c6821eecb6206f507576cd2';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(IronBankViemContractFactory) protected readonly contractFactory: IronBankViemContractFactory,
  ) {
    super(appToolkit);
  }
  getCompoundCTokenContract(address: string) {
    return this.contractFactory.ironBankCToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.ironBankComptroller({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<IronBankComptroller>) {
    return contract.read.getAllMarkets().then(v => [...v]);
  }

  async getUnderlyingAddress({ contract }: GetTokenDefinitionsParams<IronBankCToken>) {
    return contract.read.underlying();
  }

  async getExchangeRate({ contract }: GetDataPropsParams<IronBankCToken, CompoundBorrowTokenDataProps>) {
    return contract.read.exchangeRateCurrent();
  }

  async getBorrowRate({ contract }: GetDataPropsParams<IronBankCToken, CompoundBorrowTokenDataProps>) {
    return contract.read.borrowRatePerBlock().catch(() => 0);
  }

  async getCash({ contract }: GetDataPropsParams<IronBankCToken, CompoundBorrowTokenDataProps>) {
    return contract.read.getCash();
  }

  async getCTokenSupply({ contract }: GetDataPropsParams<IronBankCToken, CompoundBorrowTokenDataProps>) {
    return contract.read.totalSupply();
  }

  async getCTokenDecimals({ contract }: GetDataPropsParams<IronBankCToken, CompoundBorrowTokenDataProps>) {
    return contract.read.decimals();
  }

  async getBorrowBalance({ address, contract }: GetTokenBalancesParams<IronBankCToken, CompoundBorrowTokenDataProps>) {
    return contract.read.borrowBalanceCurrent([address]);
  }
}
