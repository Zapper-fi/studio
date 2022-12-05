import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
} from '~position/template/app-token.template.types';

import { UmamiFinanceYieldResolver } from '../common/umami-finance.marinate.token-definition-resolver';
import { UmamiFinanceContractFactory, UmamiFinanceMarinate } from '../contracts';

@PositionTemplate()
export class ArbitrumUmamiFinanceMarinateUmamiTokenFetcher extends AppTokenTemplatePositionFetcher<
  UmamiFinanceMarinate,
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UmamiFinanceYieldResolver)
    private readonly yieldResolver: UmamiFinanceYieldResolver,
    @Inject(UmamiFinanceContractFactory) protected readonly contractFactory: UmamiFinanceContractFactory,
  ) {
    super(appToolkit);
  }
  groupLabel = 'mUMAMI';
  isExcludedFromBalances = true;

  getContract(address: string): UmamiFinanceMarinate {
    return this.contractFactory.umamiFinanceMarinate({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    return ['0x2adabd6e8ce3e82f52d9998a7f64a90d294a92a4'];
  }

  async getUnderlyingTokenAddresses(): Promise<string> {
    return '0x1622bf67e6e5747b81866fe0b85178a93c7f86e3';
  }

  async getReserves({ appToken }: GetDataPropsParams<UmamiFinanceMarinate>) {
    return [Number(appToken.pricePerShare[0]) * appToken.supply];
  }

  async getLiquidity({ appToken }: GetDataPropsParams<UmamiFinanceMarinate>) {
    return appToken.supply * appToken.price;
  }

  async getApy(_params: GetDataPropsParams<UmamiFinanceMarinate>) {
    const { apr } = await this.yieldResolver.getYield();
    return Number(apr);
  }
}
