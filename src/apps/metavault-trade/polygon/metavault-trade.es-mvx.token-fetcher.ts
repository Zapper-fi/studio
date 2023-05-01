import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { MetavaultTradeContractFactory } from '../contracts';

@PositionTemplate()
export class PolygonMetavaultTradeEsMvxTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  groupLabel = 'esMVX';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MetavaultTradeContractFactory) protected readonly contractFactory: MetavaultTradeContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Erc20 {
    return this.contractFactory.erc20({ network: this.network, address });
  }

  async getAddresses() {
    return ['0xd1b2f8dff8437be57430ee98767d512f252ead61'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x2760e46d9bb43dafcbecaad1f64b93207f9f0ed7', network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
