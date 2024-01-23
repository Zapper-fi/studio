import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetUnderlyingTokensParams,
  DefaultAppTokenDataProps,
  GetPricePerShareParams,
  GetDataPropsParams,
} from '~position/template/app-token.template.types';

import { CompoundSupplyTokenFetcher, GetMarketsParams } from '../common/compound.supply.token-fetcher';
import { CompoundViemContractFactory } from '../contracts';
import { CompoundComptroller, CompoundCToken } from '../contracts/viem';

@PositionTemplate()
export class EthereumCompoundSupplyTokenFetcher extends CompoundSupplyTokenFetcher<
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

  async getUnderlyingAddress({ contract }: GetUnderlyingTokensParams<CompoundCToken>) {
    return contract.read.underlying();
  }

  async getExchangeRate({ contract }: GetPricePerShareParams<CompoundCToken, DefaultAppTokenDataProps>) {
    return contract.read.exchangeRateCurrent();
  }

  async getSupplyRate({ contract }: GetDataPropsParams<CompoundCToken, DefaultAppTokenDataProps>) {
    return contract.read.supplyRatePerBlock().catch(() => 0);
  }
}
