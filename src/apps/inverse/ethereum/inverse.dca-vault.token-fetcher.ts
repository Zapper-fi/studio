import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { InverseContractFactory, InverseDcaVaultToken } from '../contracts';

export type InverseDcaVaultTokenDataProps = {
  targetAddress: string;
};

@PositionTemplate()
export class EthereumInverseDcaVaultTokenFetcher extends AppTokenTemplatePositionFetcher<InverseDcaVaultToken> {
  groupLabel = 'DCA Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(InverseViemContractFactory) protected readonly contractFactory: InverseViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): InverseDcaVaultToken {
    return this.contractFactory.inverseDcaVaultToken({ address, network: this.network });
  }

  async getAddresses() {
    return [
      '0x89ec5df87a5186a0f0fa8cb84edd815de6047357', // USDC to ETH vault
      '0xc8f2e91dc9d198eded1b2778f6f2a7fd5bbeac34', // DAI to WBTC vault
      '0x41d079ce7282d49bf4888c71b5d9e4a02c371f9b', // DAI to YFI vault
      '0x2dcdca085af2e258654e47204e483127e0d8b277', // DAI to ETH vault
    ];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<InverseDcaVaultToken>) {
    return [{ address: await contract.underlying(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
