import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { CompoundSupplyTokenFetcher, GetMarketsParams } from '~apps/compound/common/compound.supply.token-fetcher';
import {
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDataPropsParams,
} from '~position/template/app-token.template.types';

import { IronBankViemContractFactory } from '../contracts';
import { IronBankComptroller, IronBankCToken } from '../contracts/viem';

@PositionTemplate()
export class OptimismIronBankSupplyTokenFetcher extends CompoundSupplyTokenFetcher<
  IronBankCToken,
  IronBankComptroller
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0xe0b57feed45e7d908f2d0dacd26f113cf26715bf';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(IronBankViemContractFactory) protected readonly contractFactory: IronBankViemContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.ironBankCToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.ironBankComptroller({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<IronBankComptroller>) {
    return contract.read.getAllMarkets().then(v => [...v]);
  }

  async getUnderlyingAddress({ contract }: GetUnderlyingTokensParams<IronBankCToken>) {
    return contract.read.underlying();
  }

  async getExchangeRate({ contract }: GetPricePerShareParams<IronBankCToken>) {
    return contract.read.exchangeRateCurrent();
  }

  async getSupplyRate({ contract }: GetDataPropsParams<IronBankCToken>) {
    return contract.read.supplyRatePerBlock().catch(() => 0);
  }
}
