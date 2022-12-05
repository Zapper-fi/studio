import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams } from '~position/template/app-token.template.types';

import { YearnContractFactory, YearnYCrv } from '../contracts';

@PositionTemplate()
export class EthereumYearnYCrvTokenTokenFetcher extends AppTokenTemplatePositionFetcher<YearnYCrv> {
  groupLabel = 'yCRV';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YearnContractFactory) protected readonly contractFactory: YearnContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): YearnYCrv {
    return this.contractFactory.yearnYCrv({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    return ['0xfcc5c47be19d06bf83eb04298b026f81069ff65b'];
  }

  async getUnderlyingTokenAddresses() {
    return '0xd533a949740bb3306d119cc777fa900ba034cd52';
  }

  async getLiquidity({ appToken }: GetDataPropsParams<YearnYCrv>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<YearnYCrv>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy() {
    return 0;
  }
}
