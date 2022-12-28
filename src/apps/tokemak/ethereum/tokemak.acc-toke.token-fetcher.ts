import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { TokemakContractFactory } from '../contracts';
import { TokemakAccToke } from '../contracts/ethers/TokemakAccToke';

@PositionTemplate()
export class EthereumTokemakAccTokeTokenFetcher extends AppTokenTemplatePositionFetcher<TokemakAccToke> {
  groupLabel = 'accTOKE';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TokemakContractFactory) private readonly contractFactory: TokemakContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TokemakAccToke {
    return this.contractFactory.tokemakAccToke({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    return ['0xa374a62ddbd21e3d5716cb04821cb710897c0972'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<TokemakAccToke>) {
    return [{ address: await contract.toke(), network: this.network }];
  }
}
