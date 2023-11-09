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

import { LodestarV0Comptroller, LodestarV0ContractFactory, LodestarV0IToken } from '../contracts';

@PositionTemplate()
export class ArbitrumLodestarV0SupplyTokenFetcher extends CompoundSupplyTokenFetcher<
  LodestarV0IToken,
  LodestarV0Comptroller
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0x92a62f8c4750d7fbdf9ee1db268d18169235117b';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LodestarV0ViemContractFactory) protected readonly contractFactory: LodestarV0ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.lodestarV0IToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.lodestarV0Comptroller({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<LodestarV0Comptroller>) {
    return contract.getAllMarkets();
  }

  async getUnderlyingAddress({ contract }: GetUnderlyingTokensParams<LodestarV0IToken>) {
    return contract.underlying();
  }

  async getExchangeRate({ contract }: GetPricePerShareParams<LodestarV0IToken>) {
    return contract.callStatic.exchangeRateCurrent();
  }

  async getSupplyRate({ contract }: GetDataPropsParams<LodestarV0IToken>) {
    return contract.supplyRatePerBlock().catch(() => 0);
  }

  async getLabel({ appToken, contract }: GetDisplayPropsParams<LodestarV0IToken>): Promise<DisplayProps['label']> {
    const [underlyingToken] = appToken.tokens;
    const [symbol, name] = await Promise.all([contract.symbol(), contract.name()]);
    if (!name.startsWith(`${symbol}-`)) return underlyingToken.symbol;
    const triggerLabel = name.replace(`${symbol}-`, '');
    return `${underlyingToken.symbol} - ${triggerLabel}`;
  }
}
