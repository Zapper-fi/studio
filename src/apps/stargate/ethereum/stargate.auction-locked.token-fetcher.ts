import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { StargateAa, StargateContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumStargateAuctionLockedTokenFetcher extends AppTokenTemplatePositionFetcher<StargateAa> {
  groupLabel = 'Auction Locked';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StargateContractFactory) protected readonly contractFactory: StargateContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StargateAa {
    return this.contractFactory.stargateAa({ address, network: this.network });
  }

  getAddresses() {
    return ['0x4dfcad285ef39fed84e77edf1b7dbc442565e55e'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<StargateAa>) {
    return [{ address: await contract.stargateToken(), network: this.network }];
  }

  async getPricePerShare() {
    return [4]; // 1 aaSTG = 4 STG
  }
}
