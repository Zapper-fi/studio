import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams } from '~position/template/app-token.template.types';

import { HedgefarmViemContractFactory } from '../contracts';
import { AlphaTwo } from '../contracts/viem';

@PositionTemplate()
export class AvalancheHedgefarmAlphaTwoTokenFetcher extends AppTokenTemplatePositionFetcher<AlphaTwo> {
  groupLabel = 'Alpha Two';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HedgefarmViemContractFactory) protected readonly contractFactory: HedgefarmViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.alphaTwo({ address, network: this.network });
  }

  async getAddresses() {
    return ['0x3c390b91fc2f248e75cd271e2dabf7dcc955b1a3'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x152b9d0fdc40c096757f570a51e494bd4b943e50', network: this.network }];
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<AlphaTwo>) {
    return [Number(await contract.read.lastUpdatedPricePerShare()) / 10 ** 8];
  }
}
