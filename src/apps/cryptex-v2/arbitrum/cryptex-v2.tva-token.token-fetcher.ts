import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetPricePerShareParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

import { CryptexV2ContractFactory, TvaToken } from '../contracts';

@PositionTemplate()
export class ArbitrumTvaTokenFetcher extends AppTokenTemplatePositionFetcher<TvaToken> {
  groupLabel = 'TVA';
  isExcludedFromTvl = true;
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CryptexV2ContractFactory) protected readonly contractFactory: CryptexV2ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TvaToken {
    return this.contractFactory.tvaToken({ address, network: this.network });
  }
  getAddresses(_params: GetAddressesParams): string[] | Promise<string[]> {
    return ['0xea281a4c70ee2ef5ce3ed70436c81c0863a3a75a'];
  }
  async getUnderlyingTokenDefinitions() {
    return [{ address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', network: this.network }];
  }
  async getPricePerShare(
    _params: GetPricePerShareParams<TvaToken, DefaultAppTokenDataProps, DefaultAppTokenDefinition>,
  ): Promise<number[]> {
    return [1];
  }
}
