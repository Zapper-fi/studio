import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  CompoundBorrowContractPositionFetcher,
  CompoundBorrowTokenDataProps,
  GetMarketsParams,
} from '~apps/compound/common/compound.borrow.contract-position-fetcher';
import {
  GetTokenDefinitionsParams,
  GetDataPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { LodestarComptroller, LodestarContractFactory, LodestarIToken } from '../contracts';

@PositionTemplate()
export class ArbitrumLodestarBorrowContractPositionFetcher extends CompoundBorrowContractPositionFetcher<
  LodestarIToken,
  LodestarComptroller
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0x92a62f8c4750d7fbdf9ee1db268d18169235117b';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LodestarContractFactory) protected readonly contractFactory: LodestarContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.lodestarIToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.lodestarComptroller({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<LodestarComptroller>) {
    return contract.getAllMarkets();
  }

  async getUnderlyingAddress({ contract }: GetTokenDefinitionsParams<LodestarIToken>) {
    return contract.underlying();
  }

  async getExchangeRate({ contract }: GetDataPropsParams<LodestarIToken, CompoundBorrowTokenDataProps>) {
    return contract.callStatic.exchangeRateCurrent();
  }

  async getBorrowRate({ contract }: GetDataPropsParams<LodestarIToken, CompoundBorrowTokenDataProps>) {
    return contract.borrowRatePerBlock().catch(() => 0);
  }

  async getCash({ contract }: GetDataPropsParams<LodestarIToken, CompoundBorrowTokenDataProps>) {
    return contract.getCash();
  }

  async getCTokenSupply({ contract }: GetDataPropsParams<LodestarIToken, CompoundBorrowTokenDataProps>) {
    return contract.totalSupply();
  }

  async getCTokenDecimals({ contract }: GetDataPropsParams<LodestarIToken, CompoundBorrowTokenDataProps>) {
    return contract.decimals();
  }

  async getBorrowBalance({ address, contract }: GetTokenBalancesParams<LodestarIToken, CompoundBorrowTokenDataProps>) {
    return contract.callStatic.borrowBalanceCurrent(address);
  }
}
