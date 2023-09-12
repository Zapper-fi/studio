import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { CamelotContractFactory, CamelotXGrail } from '../contracts';

@PositionTemplate()
export class ArbitrumXGrailTokenFetcher extends AppTokenTemplatePositionFetcher<CamelotXGrail> {
  groupLabel = 'xGRAIL';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CamelotContractFactory) private readonly contractFactory: CamelotContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): CamelotXGrail {
    return this.contractFactory.camelotXGrail({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    return ['0x3caae25ee616f2c8e13c74da0813402eae3f496b'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<CamelotXGrail>) {
    return [{ address: await contract.grailToken(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
