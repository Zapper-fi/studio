import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { DineroViemContractFactory } from '../contracts';
import { DineroPxeth } from '../contracts/viem/DineroPxeth';

@PositionTemplate()
export class EthereumDineroPirexEthTokenFetcher extends AppTokenTemplatePositionFetcher<DineroPxeth> {
  groupLabel = 'pxETH';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DineroViemContractFactory) protected readonly dineroContractFactory: DineroViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.dineroContractFactory.dineroPxeth({ address, network: this.network });
  }

  async getAddresses() {
    return ['0x04c154b66cb340f3ae24111cc767e0184ed00cc6'];
  }

  async getImages({ appToken }) {
    return [getTokenImg(appToken.address, this.network)];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x0000000000000000000000000000000000000000', network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
