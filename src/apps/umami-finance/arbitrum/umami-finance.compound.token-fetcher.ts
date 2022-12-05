import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';

import { UmamiFinanceYieldResolver } from '../common/umami-finance.marinate.token-definition-resolver';
import { UmamiFinanceCompound, UmamiFinanceContractFactory } from '../contracts';

@PositionTemplate()
export class ArbitrumUmamiFinanceCompoundTokenFetcher extends AppTokenTemplatePositionFetcher<
  UmamiFinanceCompound,
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
  groupLabel = 'Compounding Marinating UMAMI';

  getContract(address: string): UmamiFinanceCompound {
    return this.contractFactory.umamiFinanceCompound({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    return ['0x1922c36f3bc762ca300b4a46bb2102f84b1684ab'];
  }

  async getUnderlyingTokenAddresses(): Promise<string> {
    return '0x2adabd6e8ce3e82f52d9998a7f64a90d294a92a4';
  }

  async getPricePerShare({
    appToken,
  }: GetPricePerShareParams<UmamiFinanceCompound, DefaultAppTokenDataProps, DefaultAppTokenDefinition>): Promise<
    number | number[]
  > {
    const underlyingTokenContract = this.contractFactory.umamiFinanceMarinate({
      address: appToken.tokens[0].address,
      network: this.network,
    });

    const balanceRaw = await underlyingTokenContract.balanceOf(appToken.address);
    const reserve = Number(balanceRaw) / 10 ** appToken.decimals;
    const pricePerShare = reserve / appToken.supply;
    return pricePerShare;
  }

  async getReserves({ appToken }: GetDataPropsParams<UmamiFinanceCompound>) {
    const underlyingTokenContract = this.contractFactory.umamiFinanceMarinate({
      address: appToken.tokens[0].address,
      network: this.network,
    });

    const balanceRaw = await underlyingTokenContract.balanceOf(appToken.address);
    const reserve = Number(balanceRaw) / 10 ** appToken.decimals;
    return [reserve];
  }

  async getLiquidity({ appToken }: GetDataPropsParams<UmamiFinanceCompound>) {
    return appToken.supply * appToken.price;
  }

  async getApy(_params: GetDataPropsParams<UmamiFinanceCompound>) {
    const { apy } = await this.yieldResolver.getYield();
    return Number(apy);
  }
}
