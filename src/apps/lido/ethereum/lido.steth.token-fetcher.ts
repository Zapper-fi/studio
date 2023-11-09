import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { LidoViemContractFactory } from '../contracts';
import { LidoSteth } from '../contracts/viem/LidoSteth';

@PositionTemplate()
export class EthereumLidoStethTokenFetcher extends AppTokenTemplatePositionFetcher<LidoSteth> {
  groupLabel = 'stETH';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LidoViemContractFactory) protected readonly contractFactory: LidoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): LidoSteth {
    return this.contractFactory.lidoSteth({ network: this.network, address });
  }

  async getAddresses() {
    return ['0xae7ab96520de3a18e5e111b5eaab095312d7fe84'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x0000000000000000000000000000000000000000', network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
