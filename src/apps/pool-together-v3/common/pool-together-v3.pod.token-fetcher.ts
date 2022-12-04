import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';
import { GetUnderlyingTokensParams, GetDataPropsParams } from '~position/template/app-token.template.types';

import { PoolTogetherV3ContractFactory, PoolTogetherV3Pod } from '../contracts';

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

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<PoolTogetherV3Pod>) {
    const pricePerShareRaw = await contract.getPricePerShare();
    return Number(pricePerShareRaw) / 10 ** appToken.decimals;
  }

  async getUnderlyingTokenAddresses({
    contract,
  }: GetUnderlyingTokensParams<PoolTogetherV3Pod, PoolTogetherV3PodDefinition>): Promise<string | string[]> {
    const underlyingTokenAddress = await contract.token().then(addr => addr.toLowerCase());
    return [underlyingTokenAddress];
  }

  async getLiquidity({ appToken }: GetDataPropsParams<PoolTogetherV3Pod>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<PoolTogetherV3Pod>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy(_params: GetDataPropsParams<PoolTogetherV3Pod>) {
    return 0;
  }
}
