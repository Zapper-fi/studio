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
export class FantomIronBankSupplyTokenFetcher extends CompoundSupplyTokenFetcher<IronBankCToken, IronBankComptroller> {
  groupLabel = 'Lending';
  comptrollerAddress = '0x4250a6d3bd57455d7c6821eecb6206f507576cd2';

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
    return contract.read.getAllMarkets();
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
