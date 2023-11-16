import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { CompoundSupplyTokenFetcher, GetMarketsParams } from '~apps/compound/common/compound.supply.token-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { StrikeViemContractFactory } from '../contracts';
import { StrikeComptroller, StrikeSToken } from '../contracts/viem';

@PositionTemplate()
export class EthereumStrikeSupplyTokenFetcher extends CompoundSupplyTokenFetcher<StrikeSToken, StrikeComptroller> {
  groupLabel = 'Lending';
  comptrollerAddress = '0xe2e17b2cbbf48211fa7eb8a875360e5e39ba2602';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StrikeViemContractFactory) protected readonly contractFactory: StrikeViemContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.strikeSToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.strikeComptroller({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<StrikeComptroller>) {
    return contract.read.getAllMarkets().then(v => [...v]);
  }

  async getUnderlyingAddress({ contract }: GetUnderlyingTokensParams<StrikeSToken>) {
    return contract.read.underlying();
  }

  async getExchangeRate({ contract }: GetPricePerShareParams<StrikeSToken>) {
    return contract.simulate.exchangeRateCurrent().then(v => v.result);
  }

  async getSupplyRate({ contract }: GetDataPropsParams<StrikeSToken>) {
    return contract.read.supplyRatePerBlock();
  }
}
