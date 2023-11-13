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

import { LodestarV0ViemContractFactory } from '../contracts';
import { LodestarV0Comptroller, LodestarV0IToken } from '../contracts/viem';

@PositionTemplate()
export class ArbitrumLodestarV0BorrowContractPositionFetcher extends CompoundBorrowContractPositionFetcher<
  LodestarV0IToken,
  LodestarV0Comptroller
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0x92a62f8c4750d7fbdf9ee1db268d18169235117b';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LodestarV0ViemContractFactory) protected readonly contractFactory: LodestarV0ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.lodestarV0IToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.lodestarV0Comptroller({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<LodestarV0Comptroller>) {
    return contract.read.getAllMarkets().then(v => [...v]);
  }

  async getUnderlyingAddress({ contract }: GetTokenDefinitionsParams<LodestarV0IToken>) {
    return contract.read.underlying();
  }

  async getExchangeRate({ contract }: GetDataPropsParams<LodestarV0IToken, CompoundBorrowTokenDataProps>) {
    return contract.simulate.exchangeRateCurrent().then(v => v.result);
  }

  async getBorrowRate({ contract }: GetDataPropsParams<LodestarV0IToken, CompoundBorrowTokenDataProps>) {
    return contract.read.borrowRatePerBlock().catch(() => 0);
  }

  async getCash({ contract }: GetDataPropsParams<LodestarV0IToken, CompoundBorrowTokenDataProps>) {
    return contract.read.getCash();
  }

  async getCTokenSupply({ contract }: GetDataPropsParams<LodestarV0IToken, CompoundBorrowTokenDataProps>) {
    return contract.read.totalSupply();
  }

  async getCTokenDecimals({ contract }: GetDataPropsParams<LodestarV0IToken, CompoundBorrowTokenDataProps>) {
    return contract.read.decimals();
  }

  async getBorrowBalance({
    address,
    contract,
  }: GetTokenBalancesParams<LodestarV0IToken, CompoundBorrowTokenDataProps>) {
    return contract.simulate.borrowBalanceCurrent([address]).then(v => v.result);
  }
}
