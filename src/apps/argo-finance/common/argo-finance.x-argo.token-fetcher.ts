import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams } from '~position/template/app-token.template.types';

import { ArgoFinanceContractFactory, XArgo } from '../contracts';

export abstract class ArgoFinanceXargoTokenFetcher extends AppTokenTemplatePositionFetcher<XArgo> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ArgoFinanceContractFactory) private readonly contractFactory: ArgoFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): XArgo {
    return this.contractFactory.xArgo({ network: this.network, address });
  }

  async getDataProps(opts: GetDataPropsParams<XArgo>) {
    const { appToken } = opts;
    const liquidity = appToken.supply * appToken.tokens[0].price;

    return { liquidity };
  }
}
