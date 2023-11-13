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

import { CozyFinanceViemContractFactory } from '../contracts';
import { CozyFinanceComptroller, CozyFinanceCToken } from '../contracts/viem';

@PositionTemplate()
export class ArbitrumCozyFinanceBorrowContractPositionFetcher extends CompoundBorrowContractPositionFetcher<
  CozyFinanceCToken,
  CozyFinanceComptroller
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0x895879b2c1fbb6ccfcd101f2d3f3c76363664f92';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CozyFinanceViemContractFactory) protected readonly contractFactory: CozyFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.cozyFinanceCToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.cozyFinanceComptroller({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<CozyFinanceComptroller>) {
    return contract.read.getAllMarkets().then(v => [...v]);
  }

  async getUnderlyingAddress({ contract }: GetTokenDefinitionsParams<CozyFinanceCToken>) {
    return contract.read.underlying();
  }

  async getExchangeRate({ contract }: GetDataPropsParams<CozyFinanceCToken, CompoundBorrowTokenDataProps>) {
    return contract.read.exchangeRateCurrent();
  }

  async getBorrowRate({ contract }: GetDataPropsParams<CozyFinanceCToken, CompoundBorrowTokenDataProps>) {
    return contract.read.borrowRatePerBlock().catch(() => 0);
  }

  async getCash({ contract }: GetDataPropsParams<CozyFinanceCToken, CompoundBorrowTokenDataProps>) {
    return contract.read.getCash();
  }

  async getCTokenSupply({ contract }: GetDataPropsParams<CozyFinanceCToken, CompoundBorrowTokenDataProps>) {
    return contract.read.totalSupply();
  }

  async getCTokenDecimals({ contract }: GetDataPropsParams<CozyFinanceCToken, CompoundBorrowTokenDataProps>) {
    return contract.read.decimals();
  }

  async getBorrowBalance({
    address,
    contract,
  }: GetTokenBalancesParams<CozyFinanceCToken, CompoundBorrowTokenDataProps>) {
    return contract.read.borrowBalanceCurrent([address]);
  }
}
