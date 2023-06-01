import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { CompoundSupplyTokenFetcher, GetMarketsParams } from '~apps/compound/common/compound.supply.token-fetcher';
import { DisplayProps } from '~position/display.interface';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { LodestarComptroller, LodestarContractFactory, LodestarIToken } from '../contracts';

@PositionTemplate()
export class ArbitrumLodestarSupplyTokenFetcher extends CompoundSupplyTokenFetcher<
  LodestarIToken,
  LodestarComptroller
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0x92a62f8c4750d7fbdf9ee1db268d18169235117b';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LodestarContractFactory) protected readonly contractFactory: LodestarContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.lodestarIToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.lodestarComptroller({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<LodestarComptroller>) {
    return contract.getAllMarkets();
  }

  async getUnderlyingAddress({ contract }: GetUnderlyingTokensParams<LodestarIToken>) {
    return contract.underlying();
  }

  async getExchangeRate({ contract }: GetPricePerShareParams<LodestarIToken>) {
    return contract.callStatic.exchangeRateCurrent();
  }

  async getSupplyRate({ contract }: GetDataPropsParams<LodestarIToken>) {
    return contract.supplyRatePerBlock().catch(() => 0);
  }

  async getLabel({ appToken, contract }: GetDisplayPropsParams<LodestarIToken>): Promise<DisplayProps['label']> {
    const [underlyingToken] = appToken.tokens;
    const [symbol, name] = await Promise.all([contract.symbol(), contract.name()]);
    if (!name.startsWith(`${symbol}-`)) return underlyingToken.symbol;
    const triggerLabel = name.replace(`${symbol}-`, '');
    return `${underlyingToken.symbol} - ${triggerLabel}`;
  }
}
