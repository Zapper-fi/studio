import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  CompoundSupplyTokenDataProps,
  CompoundSupplyTokenFetcher,
} from '~apps/compound/common/compound.supply.token-fetcher';
import { DisplayProps } from '~position/display.interface';
import { GetDisplayPropsParams } from '~position/template/app-token.template.types';

import { CozyFinanceComptroller, CozyFinanceContractFactory, CozyFinanceCToken } from '../contracts';

@PositionTemplate()
export class EthereumCozyFinanceSupplyTokenFetcher extends CompoundSupplyTokenFetcher<
  CozyFinanceCToken,
  CozyFinanceComptroller
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0x895879b2c1fbb6ccfcd101f2d3f3c76363664f92';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CozyFinanceContractFactory) protected readonly contractFactory: CozyFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.cozyFinanceCToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.cozyFinanceComptroller({ address, network: this.network });
  }

  getMarkets(contract: CozyFinanceComptroller) {
    return contract.getAllMarkets();
  }

  async getUnderlyingAddress(contract: CozyFinanceCToken) {
    return contract.underlying();
  }

  getExchangeRate(contract: CozyFinanceCToken) {
    return contract.exchangeRateCurrent();
  }

  async getSupplyRate(contract: CozyFinanceCToken) {
    return contract.supplyRatePerBlock().catch(() => 0);
  }

  async getLabel({
    appToken,
    contract,
  }: GetDisplayPropsParams<CozyFinanceCToken, CompoundSupplyTokenDataProps>): Promise<DisplayProps['label']> {
    const [underlyingToken] = appToken.tokens;
    const [symbol, name] = await Promise.all([contract.symbol(), contract.name()]);
    if (!name.startsWith(`${symbol}-`)) return underlyingToken.symbol;
    const triggerLabel = name.replace(`${symbol}-`, '');
    return `${underlyingToken.symbol} - ${triggerLabel}`;
  }
}
