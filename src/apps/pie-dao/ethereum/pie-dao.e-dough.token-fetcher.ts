import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { PieDaoViemContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumPieDaoEDoughTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  groupLabel = 'eDOUGH';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PieDaoViemContractFactory) protected readonly contractFactory: PieDaoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.erc20({ address, network: this.network });
  }

  getAddresses() {
    return ['0x63cbd1858bd79de1a06c3c26462db360b834912d'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0xad32a8e6220741182940c5abf610bde99e737b2d', network: this.network }]; // DOUGH
  }

  async getPricePerShare() {
    return [1];
  }
}
