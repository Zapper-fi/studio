import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Erc20 } from '~contract/contracts/viem';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { UnderlyingTokenDefinition, GetPricePerShareParams } from '~position/template/app-token.template.types';

import { VelaViemContractFactory } from '../contracts';

export abstract class VelaVlpTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  groupLabel = 'VLP';

  abstract vlpAddress: string;
  abstract usdcAddress: string;
  abstract vaultAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VelaViemContractFactory) private readonly velaContractFactory: VelaViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.appToolkit.globalViemContracts.erc20({
      address,
      network: this.network,
    });
  }

  async getAddresses(): Promise<string[]> {
    return [this.vlpAddress];
  }

  async getUnderlyingTokenDefinitions(): Promise<UnderlyingTokenDefinition[]> {
    return [{ address: this.usdcAddress, network: this.network }];
  }

  async getPricePerShare({ multicall }: GetPricePerShareParams<Erc20>): Promise<number[]> {
    const velaVault = multicall.wrap(
      this.velaContractFactory.velaVault({
        address: this.vaultAddress,
        network: this.network,
      }),
    );
    const basisPointsDivisor = 100000;

    const vlpPrice = await velaVault.getVLPPrice();
    const pricePerShare = Number(vlpPrice) / Number(basisPointsDivisor);

    return [pricePerShare];
  }
}
