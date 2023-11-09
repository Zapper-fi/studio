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
export class EthereumIronBankBorrowContractPositionFetcher extends CompoundBorrowContractPositionFetcher<
  IronBankCToken,
  IronBankComptroller
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0xab1c342c7bf5ec5f02adea1c2270670bca144cbb';

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
    return contract.getAllMarkets();
  }

  async getUnderlyingAddress({ contract }: GetTokenDefinitionsParams<IronBankCToken>) {
    return contract.underlying();
  }

  async getExchangeRate({ contract }: GetDataPropsParams<IronBankCToken, CompoundBorrowTokenDataProps>) {
    return contract.exchangeRateCurrent();
  }

  async getBorrowRate({ contract }: GetDataPropsParams<IronBankCToken, CompoundBorrowTokenDataProps>) {
    return contract.borrowRatePerBlock().catch(() => 0);
  }

  async getCash({ contract }: GetDataPropsParams<IronBankCToken, CompoundBorrowTokenDataProps>) {
    return contract.getCash();
  }

  async getCTokenSupply({ contract }: GetDataPropsParams<IronBankCToken, CompoundBorrowTokenDataProps>) {
    return contract.totalSupply();
  }

  async getCTokenDecimals({ contract }: GetDataPropsParams<IronBankCToken, CompoundBorrowTokenDataProps>) {
    return contract.decimals();
  }

  async getBorrowBalance({ address, contract }: GetTokenBalancesParams<IronBankCToken, CompoundBorrowTokenDataProps>) {
    return contract.borrowBalanceCurrent(address);
  }
}
