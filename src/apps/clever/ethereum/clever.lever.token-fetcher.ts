import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts/viem';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { CleverViemContractFactory } from '../contracts';

import { CVX, CLEVCVX } from './addresses';

@PositionTemplate()
export class EthereumCleverLeverTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  groupLabel = 'ClevCVX';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CleverViemContractFactory) protected readonly contractFactory: CleverViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.appToolkit.globalViemContracts.erc20({ address, network: this.network });
  }

  getAddresses() {
    return [CLEVCVX];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: CVX, network: this.network }];
  }

  async getPricePerShare() {
    // TODO: use Curve pool to determine price
    return [1];
  }
}
