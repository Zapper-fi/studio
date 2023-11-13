import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetTokenDefinitionsParams,
  GetDataPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import {
  CompoundBorrowContractPositionFetcher,
  CompoundBorrowTokenDataProps,
  GetMarketsParams,
} from '../common/compound.borrow.contract-position-fetcher';
import { CompoundViemContractFactory } from '../contracts';
import { CompoundComptroller, CompoundCToken } from '../contracts/viem';

@PositionTemplate()
export class EthereumCompoundBorrowContractPositionFetcher extends CompoundBorrowContractPositionFetcher<
  CompoundCToken,
  CompoundComptroller
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CompoundViemContractFactory) protected readonly contractFactory: CompoundViemContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.compoundCToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.compoundComptroller({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<CompoundComptroller>) {
    return contract.read.getAllMarkets().then(v => [...v]);
  }

  async getUnderlyingAddress({ contract }: GetTokenDefinitionsParams<CompoundCToken>) {
    return contract.read.underlying();
  }

  async getExchangeRate({ contract }: GetDataPropsParams<CompoundCToken, CompoundBorrowTokenDataProps>) {
    return contract.read.exchangeRateCurrent();
  }

  async getBorrowRate({ contract }: GetDataPropsParams<CompoundCToken, CompoundBorrowTokenDataProps>) {
    return contract.read.borrowRatePerBlock().catch(() => 0);
  }

  async getCash({ contract }: GetDataPropsParams<CompoundCToken, CompoundBorrowTokenDataProps>) {
    return contract.read.getCash();
  }

  async getCTokenSupply({ contract }: GetDataPropsParams<CompoundCToken, CompoundBorrowTokenDataProps>) {
    return contract.read.totalSupply();
  }

  async getCTokenDecimals({ contract }: GetDataPropsParams<CompoundCToken, CompoundBorrowTokenDataProps>) {
    return contract.read.decimals();
  }

  async getBorrowBalance({ address, contract }: GetTokenBalancesParams<CompoundCToken, CompoundBorrowTokenDataProps>) {
    return contract.read.borrowBalanceCurrent([address]);
  }
}
