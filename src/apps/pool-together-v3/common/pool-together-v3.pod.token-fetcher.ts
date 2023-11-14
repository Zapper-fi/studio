import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { PoolTogetherV3ViemContractFactory } from '../contracts';
import { PoolTogetherV3Pod } from '../contracts/viem';

type PoolTogetherV3PodDefinition = DefaultAppTokenDefinition & {
  underlyingTokenAddress: string;
};

export abstract class PoolTogetherV3PodTokenFetcher extends AppTokenTemplatePositionFetcher<
  PoolTogetherV3Pod,
  DefaultAppTokenDataProps,
  PoolTogetherV3PodDefinition
> {
  abstract registryAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV3ViemContractFactory) private readonly contractFactory: PoolTogetherV3ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.poolTogetherV3Pod({ address, network: this.network });
  }

  async getAddresses({ multicall }: GetAddressesParams): Promise<string[]> {
    const registryContract = multicall.wrap(
      this.contractFactory.poolTogetherV3PodRegistry({ address: this.registryAddress, network: this.network }),
    );

    return registryContract.read.getAddresses().then(v => [...v]);
  }

  async getLabel({ contract }: GetDisplayPropsParams<PoolTogetherV3Pod>) {
    return contract.read.name();
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<PoolTogetherV3Pod>) {
    const pricePerShareRaw = await contract.read.getPricePerShare();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.decimals;
    return [pricePerShare];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<PoolTogetherV3Pod>) {
    return [{ address: await contract.read.token(), network: this.network }];
  }
}
