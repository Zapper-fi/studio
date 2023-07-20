import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
  GetPricePerShareParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

import { CryptexV2ContractFactory } from '../contracts';

@PositionTemplate()
export class ArbitrumCryptexV2TokenTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  groupLabel: string;

  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CryptexV2ContractFactory) private readonly cryptexV2ContractFactory: CryptexV2ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(_address: string): Erc20 {
    return this.contractFactory.token({ address, network: this.network });
  }

  async getAddresses(_params: GetAddressesParams<DefaultAppTokenDefinition>): Promise<string[]> {
    throw new Error('Method not implemented.');
  }

  async getUnderlyingTokenDefinitions(
    _params: GetUnderlyingTokensParams<Erc20, DefaultAppTokenDefinition>,
  ): Promise<UnderlyingTokenDefinition[]> {
    throw new Error('Method not implemented.');
  }

  async getPricePerShare(
    _params: GetPricePerShareParams<Erc20, DefaultAppTokenDataProps, DefaultAppTokenDefinition>,
  ): Promise<number[]> {
    throw new Error('Method not implemented.');
  }
}
