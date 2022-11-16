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

import { BastionProtocolComptroller, BastionProtocolContractFactory, BastionProtocolCtoken } from '../contracts';

@PositionTemplate()
export class AuroraBastionProtocolStakedNearBorrowContractPositionFetcher extends CompoundBorrowContractPositionFetcher<
  BastionProtocolCtoken,
  BastionProtocolComptroller
> {
  groupLabel = 'Staked NEAR Realm';
  comptrollerAddress = '0xe550a886716241afb7ee276e647207d7667e1e79';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BastionProtocolContractFactory) protected readonly contractFactory: BastionProtocolContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.bastionProtocolCtoken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.bastionProtocolComptroller({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<BastionProtocolComptroller>) {
    return contract.getAllMarkets();
  }

  async getUnderlyingAddress({ contract }: GetTokenDefinitionsParams<BastionProtocolCtoken>) {
    return contract.underlying();
  }

  async getExchangeRate({ contract }: GetDataPropsParams<BastionProtocolCtoken, CompoundBorrowTokenDataProps>) {
    return contract.callStatic.exchangeRateCurrent();
  }

  async getExchangeRateMantissa(params: GetDataPropsParams<BastionProtocolCtoken, CompoundBorrowTokenDataProps>) {
    const [underlyingToken] = params.contractPosition.tokens;
    const auTokenDecimals = await this.getCTokenDecimals(params);
    return 18 + underlyingToken.decimals - auTokenDecimals;
  }

  async getBorrowRate({ contract }: GetDataPropsParams<BastionProtocolCtoken, CompoundBorrowTokenDataProps>) {
    return contract.callStatic.borrowRatePerBlock().catch(() => 0);
  }

  async getCash({ contract }: GetDataPropsParams<BastionProtocolCtoken, CompoundBorrowTokenDataProps>) {
    return contract.getCash();
  }

  async getCTokenSupply({ contract }: GetDataPropsParams<BastionProtocolCtoken, CompoundBorrowTokenDataProps>) {
    return contract.totalSupply();
  }

  async getCTokenDecimals({ contract }: GetDataPropsParams<BastionProtocolCtoken, CompoundBorrowTokenDataProps>) {
    return contract.decimals();
  }

  async getBorrowBalance({
    address,
    contract,
  }: GetTokenBalancesParams<BastionProtocolCtoken, CompoundBorrowTokenDataProps>) {
    return contract.callStatic.borrowBalanceCurrent(address);
  }
}
