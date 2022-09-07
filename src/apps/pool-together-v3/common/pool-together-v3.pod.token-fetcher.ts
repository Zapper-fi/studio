import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';
import { GetUnderlyingTokensParams, GetDataPropsParams } from '~position/template/app-token.template.types';

import { PoolTogetherV3ContractFactory, PoolTogetherV3Pod } from '../contracts';

type Definition = DefaultAppTokenDefinition & {
  underlyingTokenAddress: string;
};

type PoolTogetherV3PodDataProps = {
  liquidity: number;
};

export abstract class PoolTogetherV3PodTokenFetcher extends AppTokenTemplatePositionFetcher<
  PoolTogetherV3Pod,
  DefaultDataProps,
  Definition
> {
  abstract registryAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV3ContractFactory) private readonly contractFactory: PoolTogetherV3ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PoolTogetherV3Pod {
    return this.contractFactory.poolTogetherV3Pod({ address, network: this.network });
  }

  async getAddresses({ multicall }: GetAddressesParams): Promise<string[]> {
    const registryContract = multicall.wrap(
      this.contractFactory.poolTogetherV3PodRegistry({ address: this.registryAddress, network: this.network }),
    );
    return registryContract.getAddresses();
  }

  async getLabel({ contract }: GetDisplayPropsParams<PoolTogetherV3Pod>) {
    return contract.name();
  }

  async getPricePerShare({
    contract,
    appToken,
  }: GetPricePerShareParams<PoolTogetherV3Pod, PoolTogetherV3PodDataProps>) {
    const pricePerShareRaw = await contract.getPricePerShare();
    return Number(pricePerShareRaw) / 10 ** appToken.decimals;
  }

  async getUnderlyingTokenAddresses({
    contract,
  }: GetUnderlyingTokensParams<PoolTogetherV3Pod, Definition>): Promise<string | string[]> {
    const underlyingTokenAddress = await contract.token().then(addr => addr.toLowerCase());
    return [underlyingTokenAddress];
  }

  async getDataProps({
    appToken,
  }: GetDataPropsParams<PoolTogetherV3Pod, PoolTogetherV3PodDataProps>): Promise<PoolTogetherV3PodDataProps> {
    const liquidity = appToken.price * appToken.supply;
    return { liquidity };
  }
}
