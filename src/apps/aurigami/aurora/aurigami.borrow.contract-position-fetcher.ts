import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  CompoundBorrowContractPositionFetcher,
  CompoundBorrowTokenDataProps,
} from '~apps/compound/common/compound.borrow.contract-position-fetcher';
import { GetDataPropsParams } from '~position/template/contract-position.template.types';
import { Network } from '~types/network.interface';

import { AURIGAMI_DEFINITION } from '../aurigami.definition';
import { AurigamiAuToken, AurigamiComptroller, AurigamiContractFactory } from '../contracts';

@Injectable()
export class AuroraAurigamiBorrowContractPositionFetcher extends CompoundBorrowContractPositionFetcher<
  AurigamiAuToken,
  AurigamiComptroller
> {
  appId = AURIGAMI_DEFINITION.id;
  groupId = AURIGAMI_DEFINITION.groups.borrow.id;
  network = Network.AURORA_MAINNET;
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

  getMarkets(contract: AurigamiComptroller) {
    return contract.getAllMarkets();
  }

  async getUnderlyingAddress(contract: AurigamiAuToken) {
    return contract.underlying();
  }

  getExchangeRate(contract: AurigamiAuToken) {
    return contract.callStatic.exchangeRateCurrent();
  }

  async getExchangeRateMantissa({
    contract,
    contractPosition,
  }: GetDataPropsParams<AurigamiAuToken, CompoundBorrowTokenDataProps>) {
    const [underlyingToken] = contractPosition.tokens;
    const auTokenDecimals = await this.getCTokenDecimals(contract);
    return 18 + underlyingToken.decimals - auTokenDecimals;
  }

  async getBorrowRate(contract: AurigamiAuToken) {
    return contract.callStatic.borrowRatePerTimestamp().catch(() => 0);
  }

  getCTokenSupply(contract: AurigamiAuToken) {
    return contract.totalSupply();
  }

  getCTokenDecimals(contract: AurigamiAuToken) {
    return contract.decimals();
  }

  getBorrowBalance({ address, contract }: { address: string; contract: AurigamiAuToken }) {
    return contract.callStatic.borrowBalanceCurrent(address);
  }

  getCash(contract: AurigamiAuToken) {
    return contract.getCash();
  }
}
