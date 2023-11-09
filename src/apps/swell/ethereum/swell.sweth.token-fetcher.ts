import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
  GetPricePerShareParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

import { SwellViemContractFactory } from '../contracts';
import { Sweth } from '../contracts/viem';

@PositionTemplate()
export class EthereumSwellSwethTokenFetcher extends AppTokenTemplatePositionFetcher<Sweth> {
  groupLabel = 'swETH';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SwellViemContractFactory) protected readonly contractFactory: SwellViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(_address: string) {
    return this.contractFactory.sweth({ network: this.network, address: _address });
  }

  async getAddresses(_params: GetAddressesParams<DefaultAppTokenDefinition>): Promise<string[]> {
    return ['0xf951e335afb289353dc249e82926178eac7ded78'];
  }

  async getUnderlyingTokenDefinitions(
    _params: GetUnderlyingTokensParams<Sweth, DefaultAppTokenDefinition>,
  ): Promise<UnderlyingTokenDefinition[]> {
    return [{ address: '0x0000000000000000000000000000000000000000', network: this.network }];
  }

  async getPricePerShare({
    contract,
    appToken,
  }: GetPricePerShareParams<Sweth, DefaultAppTokenDataProps, DefaultAppTokenDefinition>): Promise<number[]> {
    const pricePerShareRaw = await contract.read.getRate();
    return [Number(pricePerShareRaw) / 10 ** appToken.decimals];
  }
}
