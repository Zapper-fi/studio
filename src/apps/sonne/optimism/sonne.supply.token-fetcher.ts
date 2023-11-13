import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { CompoundSupplyTokenFetcher, GetMarketsParams } from '~apps/compound/common/compound.supply.token-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { SonneViemContractFactory } from '../contracts';
import { SonneComptroller, SonneSoToken } from '../contracts/viem';

@PositionTemplate()
export class OptimismSonneSupplyTokenFetcher extends CompoundSupplyTokenFetcher<SonneSoToken, SonneComptroller> {
  groupLabel = 'Lending';
  comptrollerAddress = '0x60cf091cd3f50420d50fd7f707414d0df4751c58';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SonneViemContractFactory) protected readonly contractFactory: SonneViemContractFactory,
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
    return contract.read.getAllMarkets().then(v => [...v]);
  }

  async getUnderlyingAddress({ contract }: GetUnderlyingTokensParams<SonneSoToken>) {
    return contract.read.underlying();
  }

  async getExchangeRate({ contract }: GetPricePerShareParams<SonneSoToken>) {
    return contract.simulate.exchangeRateCurrent().then(v => v.result);
  }

  async getSupplyRate({ contract }: GetDataPropsParams<SonneSoToken>) {
    return contract.read.supplyRatePerBlock();
  }
}
