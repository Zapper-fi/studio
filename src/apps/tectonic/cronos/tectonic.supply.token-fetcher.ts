import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { CompoundSupplyTokenFetcher, GetMarketsParams } from '~apps/compound/common/compound.supply.token-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { TectonicContractFactory, TectonicCore, TectonicTToken } from '../contracts';

@PositionTemplate()
export class CronosTectonicSupplyTokenFetcher extends CompoundSupplyTokenFetcher<TectonicTToken, TectonicCore> {
  groupLabel = 'Lending';
  comptrollerAddress = '0xb3831584acb95ed9ccb0c11f677b5ad01deaeec0';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TectonicContractFactory) protected readonly contractFactory: TectonicContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.tectonicTToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.tectonicCore({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<TectonicCore>) {
    return contract.getAllMarkets();
  }

  async getUnderlyingAddress({ contract }: GetUnderlyingTokensParams<TectonicTToken>) {
    return contract.underlying();
  }

  async getExchangeRate({ contract }: GetPricePerShareParams<TectonicTToken>) {
    return contract.underlying();
  }

  async getSupplyRate({ contract }: GetDataPropsParams<TectonicTToken>) {
    return contract.supplyRatePerBlock().catch(() => 0);
  }
}
