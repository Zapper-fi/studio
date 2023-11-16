import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { CamelotViemContractFactory } from '../contracts';
import { CamelotXGrail } from '../contracts/viem';

@PositionTemplate()
export class ArbitrumXGrailTokenFetcher extends AppTokenTemplatePositionFetcher<CamelotXGrail> {
  groupLabel = 'xGRAIL';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CamelotViemContractFactory) private readonly contractFactory: CamelotViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.camelotXGrail({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    return ['0x3caae25ee616f2c8e13c74da0813402eae3f496b'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<CamelotXGrail>) {
    return [{ address: await contract.read.grailToken(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
