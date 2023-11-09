import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { CompoundSupplyTokenFetcher, GetMarketsParams } from '~apps/compound/common/compound.supply.token-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { IronBankViemContractFactory } from '../contracts';
import { IronBankComptroller, IronBankCToken } from '../contracts/viem';

@PositionTemplate()
export class EthereumIronBankSupplyTokenFetcher extends CompoundSupplyTokenFetcher<
  IronBankCToken,
  IronBankComptroller
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0xab1c342c7bf5ec5f02adea1c2270670bca144cbb';

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
    return contract.getAllMarkets();
  }

  async getUnderlyingAddress({ contract }: GetUnderlyingTokensParams<IronBankCToken>) {
    return contract.underlying();
  }

  async getExchangeRate({ contract }: GetPricePerShareParams<IronBankCToken>) {
    return contract.exchangeRateCurrent();
  }

  async getSupplyRate({ contract }: GetDataPropsParams<IronBankCToken>) {
    return contract.supplyRatePerBlock().catch(() => 0);
  }
}
