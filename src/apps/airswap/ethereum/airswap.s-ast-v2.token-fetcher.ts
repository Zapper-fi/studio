import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { AirswapViemContractFactory } from '../contracts';
import { StakingV2 } from '../contracts/viem';

@PositionTemplate()
export class EthereumAirswapSAstV2TokenFetcher extends AppTokenTemplatePositionFetcher<StakingV2> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AirswapViemContractFactory) private readonly contractFactory: AirswapViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.stakingV2({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    return ['0x579120871266ccd8de6c85ef59e2ff6743e7cd15'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<StakingV2>) {
    return [{ address: await contract.read.token(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getLabel(): Promise<string> {
    return 'sAST v2';
  }
}
