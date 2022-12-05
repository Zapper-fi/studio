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

import { AurigamiAuToken, AurigamiComptroller, AurigamiContractFactory } from '../contracts';

@PositionTemplate()
export class AuroraAurigamiBorrowContractPositionFetcher extends CompoundBorrowContractPositionFetcher<
  AurigamiAuToken,
  AurigamiComptroller
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0x817af6cfaf35bdc1a634d6cc94ee9e4c68369aeb';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AurigamiContractFactory) protected readonly contractFactory: AurigamiContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.aurigamiAuToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.aurigamiComptroller({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<AurigamiComptroller>) {
    return contract.getAllMarkets();
  }

  async getUnderlyingAddress({ contract }: GetTokenDefinitionsParams<AurigamiAuToken>) {
    return contract.underlying();
  }

  async getExchangeRate({ contract }: GetDataPropsParams<AurigamiAuToken, CompoundBorrowTokenDataProps>) {
    return contract.callStatic.exchangeRateCurrent();
  }

  async getExchangeRateMantissa(params: GetDataPropsParams<AurigamiAuToken, CompoundBorrowTokenDataProps>) {
    const [underlyingToken] = params.contractPosition.tokens;
    const auTokenDecimals = await this.getCTokenDecimals(params);
    return 18 + underlyingToken.decimals - auTokenDecimals;
  }

  async getBorrowRate({ contract }: GetDataPropsParams<AurigamiAuToken, CompoundBorrowTokenDataProps>) {
    return contract.callStatic.borrowRatePerTimestamp().catch(() => 0);
  }

  async getCash({ contract }: GetDataPropsParams<AurigamiAuToken, CompoundBorrowTokenDataProps>) {
    return contract.getCash();
  }

  async getCTokenSupply({ contract }: GetDataPropsParams<AurigamiAuToken, CompoundBorrowTokenDataProps>) {
    return contract.totalSupply();
  }

  async getCTokenDecimals({ contract }: GetDataPropsParams<AurigamiAuToken, CompoundBorrowTokenDataProps>) {
    return contract.decimals();
  }

  async getBorrowBalance({ address, contract }: GetTokenBalancesParams<AurigamiAuToken, CompoundBorrowTokenDataProps>) {
    return contract.callStatic.borrowBalanceCurrent(address);
  }
}
