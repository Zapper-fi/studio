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

import { CozyFinanceViemContractFactory } from '../contracts';
import { CozyFinanceComptroller, CozyFinanceCToken } from '../contracts/viem';

@PositionTemplate()
export class ArbitrumCozyFinanceSupplyTokenFetcher extends CompoundSupplyTokenFetcher<
  CozyFinanceCToken,
  CozyFinanceComptroller
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0x895879b2c1fbb6ccfcd101f2d3f3c76363664f92';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CozyFinanceViemContractFactory) protected readonly contractFactory: CozyFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.cozyFinanceCToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.cozyFinanceComptroller({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<CozyFinanceComptroller>) {
    return contract.read.getAllMarkets().then(v => [...v]);
  }

  async getUnderlyingAddress({ contract }: GetUnderlyingTokensParams<CozyFinanceCToken>) {
    return contract.read.underlying();
  }

  async getExchangeRate({ contract }: GetPricePerShareParams<CozyFinanceCToken>) {
    return contract.read.exchangeRateCurrent();
  }

  async getSupplyRate({ contract }: GetDataPropsParams<CozyFinanceCToken>) {
    return contract.read.supplyRatePerBlock().catch(() => 0);
  }

  async getLabel({ appToken, contract }: GetDisplayPropsParams<CozyFinanceCToken>): Promise<DisplayProps['label']> {
    const [underlyingToken] = appToken.tokens;
    const [symbol, name] = await Promise.all([contract.read.symbol(), contract.read.name()]);
    if (!name.startsWith(`${symbol}-`)) return underlyingToken.symbol;
    const triggerLabel = name.replace(`${symbol}-`, '');
    return `${underlyingToken.symbol} - ${triggerLabel}`;
  }
}
