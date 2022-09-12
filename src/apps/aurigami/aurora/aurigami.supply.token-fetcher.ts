import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  CompoundSupplyTokenDataProps,
  CompoundSupplyTokenFetcher,
} from '~apps/compound/common/compound.supply.token-fetcher';
import { GetPricePerShareParams } from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { AURIGAMI_DEFINITION } from '../aurigami.definition';
import { AurigamiAuToken, AurigamiComptroller, AurigamiContractFactory } from '../contracts';

@Injectable()
export class AuroraAurigamiSupplyTokenFetcher extends CompoundSupplyTokenFetcher<AurigamiAuToken, AurigamiComptroller> {
  appId = AURIGAMI_DEFINITION.id;
  groupId = AURIGAMI_DEFINITION.groups.supply.id;
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

  async getExchangeRateMantissa({ appToken }: GetPricePerShareParams<AurigamiAuToken, CompoundSupplyTokenDataProps>) {
    const [underlyingToken] = appToken.tokens;
    return 18 + underlyingToken.decimals - appToken.decimals;
  }

  async getSupplyRate(contract: AurigamiAuToken) {
    return contract.supplyRatePerTimestamp().catch(() => 0);
  }
}
