import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { GainsNetworkContractFactory, GainsNetworkGToken } from '../contracts';

export abstract class GainsNetworkGTokenTokenFetcher extends AppTokenTemplatePositionFetcher<GainsNetworkGToken> {
  groupLabel = 'gTokens';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GainsNetworkContractFactory) protected readonly contractFactory: GainsNetworkContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): GainsNetworkGToken {
    return this.contractFactory.gainsNetworkGToken({ network: this.network, address });
  }

  async getAddresses() {
    return ['0xd85e038593d7a098614721eae955ec2022b9b91b'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<GainsNetworkGToken>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<GainsNetworkGToken>) {
    const pricePerShareRaw = await contract.shareToAssetsPrice();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.decimals;

    return [pricePerShare];
  }
}
