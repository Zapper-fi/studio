import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { GainsNetworkViemContractFactory } from '../contracts';
import { GainsNetworkGToken } from '../contracts/viem';

export abstract class GainsNetworkGTokenTokenFetcher extends AppTokenTemplatePositionFetcher<GainsNetworkGToken> {
  groupLabel = 'gTokens';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GainsNetworkViemContractFactory) protected readonly contractFactory: GainsNetworkViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.gainsNetworkGToken({ network: this.network, address });
  }

  async getAddresses() {
    return ['0xd85e038593d7a098614721eae955ec2022b9b91b'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<GainsNetworkGToken>) {
    return [{ address: await contract.read.asset(), network: this.network }];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<GainsNetworkGToken>) {
    const pricePerShareRaw = await contract.read.shareToAssetsPrice();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.decimals;

    return [pricePerShare];
  }
}
