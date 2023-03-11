import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { ConvexContractFactory, ConvexStashTokenWrapped } from '../contracts';

@PositionTemplate()
export class EthereumConvexStashTokenWrappedTokenFetcher extends AppTokenTemplatePositionFetcher<ConvexStashTokenWrapped> {
  groupLabel = 'Stash Token Wrapped';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConvexContractFactory) protected readonly contractFactory: ConvexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ConvexStashTokenWrapped {
    return this.contractFactory.convexStashTokenWrapped({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    return [
      '0xf132a783d8567c11d3df3e4ef890786affc16402',
      '0xe657aa15ec2eec10facbdc68d388895dd700a0d5',
      '0x49b559563ab764381554feee9951e9ec899c5952',
      '0xad2074172e212dcf82ec94558209c88156764a93',
      '0xbb554e5e8ec27a2b8f6d5cd269fec43e9637018b',
    ];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<ConvexStashTokenWrapped>) {
    return [{ address: await contract.token(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
