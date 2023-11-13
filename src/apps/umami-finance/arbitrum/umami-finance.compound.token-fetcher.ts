import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { UmamiFinanceYieldResolver } from '../common/umami-finance.yield-resolver';
import { UmamiFinanceViemContractFactory } from '../contracts';
import { UmamiFinanceCompound } from '../contracts/viem';

@PositionTemplate()
export class ArbitrumUmamiFinanceCompoundTokenFetcher extends AppTokenTemplatePositionFetcher<UmamiFinanceCompound> {
  groupLabel = 'Compounding Marinating UMAMI';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UmamiFinanceYieldResolver)
    private readonly yieldResolver: UmamiFinanceYieldResolver,
    @Inject(UmamiFinanceViemContractFactory) protected readonly contractFactory: UmamiFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.umamiFinanceCompound({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    return ['0x1922c36f3bc762ca300b4a46bb2102f84b1684ab'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x2adabd6e8ce3e82f52d9998a7f64a90d294a92a4', network: this.network }];
  }

  async getPricePerShare({ appToken }: GetPricePerShareParams<UmamiFinanceCompound>) {
    const underlyingTokenContract = this.contractFactory.umamiFinanceMarinate({
      address: appToken.tokens[0].address,
      network: this.network,
    });

    const balanceRaw = await underlyingTokenContract.read.balanceOf([appToken.address]);
    const reserve = Number(balanceRaw) / 10 ** appToken.decimals;
    const pricePerShare = reserve / appToken.supply;
    return [pricePerShare];
  }

  async getReserves({ appToken }: GetDataPropsParams<UmamiFinanceCompound>) {
    const underlyingTokenContract = this.contractFactory.umamiFinanceMarinate({
      address: appToken.tokens[0].address,
      network: this.network,
    });

    const balanceRaw = await underlyingTokenContract.read.balanceOf([appToken.address]);
    const reserve = Number(balanceRaw) / 10 ** appToken.decimals;
    return [reserve];
  }

  async getApy(_params: GetDataPropsParams<UmamiFinanceCompound>) {
    const { apy } = await this.yieldResolver.getStakingYield();
    return Number(apy);
  }

  async getImages({ appToken }: GetDisplayPropsParams<UmamiFinanceCompound>): Promise<string[]> {
    return [getTokenImg(appToken.address, this.network)];
  }
}
