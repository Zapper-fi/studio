import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { CompoundSupplyTokenFetcher, GetMarketsParams } from '~apps/compound/common/compound.supply.token-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { SonneComptroller, SonneContractFactory, SonneSoToken } from '../contracts';

@PositionTemplate()
export class BaseSonneSupplyTokenFetcher extends CompoundSupplyTokenFetcher<SonneSoToken, SonneComptroller> {
  groupLabel = 'Lending';
  comptrollerAddress = '0x1db2466d9f5e10d7090e7152b68d62703a2245f0';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SonneContractFactory) protected readonly contractFactory: SonneContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.sonneSoToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.sonneComptroller({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<SonneComptroller>) {
    return contract.getAllMarkets();
  }

  async getUnderlyingAddress({ contract }: GetUnderlyingTokensParams<SonneSoToken>) {
    return contract.underlying();
  }

  async getExchangeRate({ contract }: GetPricePerShareParams<SonneSoToken>) {
    return contract.callStatic.exchangeRateCurrent();
  }

  async getSupplyRate({ contract }: GetDataPropsParams<SonneSoToken>) {
    return contract.supplyRatePerBlock();
  }
}
