import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDisplayPropsParams } from '~position/template/app-token.template.types';

import { UmamiFinanceViemContractFactory } from '../contracts';
import { UmamiFinanceMarinate } from '../contracts/viem';

@PositionTemplate()
export class ArbitrumUmamiFinanceMarinateUmamiTokenFetcher extends AppTokenTemplatePositionFetcher<UmamiFinanceMarinate> {
  groupLabel = 'mUMAMI';
  isExcludedFromBalances = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UmamiFinanceViemContractFactory) protected readonly contractFactory: UmamiFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.umamiFinanceMarinate({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    return ['0x2adabd6e8ce3e82f52d9998a7f64a90d294a92a4'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x1622bf67e6e5747b81866fe0b85178a93c7f86e3', network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getImages({ appToken }: GetDisplayPropsParams<UmamiFinanceMarinate>): Promise<string[]> {
    return [getTokenImg(appToken.address, this.network)];
  }
}
