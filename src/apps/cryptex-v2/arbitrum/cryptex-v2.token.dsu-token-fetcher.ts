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

import { CryptexV2ContractFactory, DsuToken } from '../contracts';

@PositionTemplate()
export class ArbitrumDsuTokenFetcher extends AppTokenTemplatePositionFetcher<DsuToken> {
  groupLabel = 'DSU';
  isExcludedFromTvl = true;
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CryptexV2ContractFactory) protected readonly contractFactory: CryptexV2ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): DsuToken {
    return this.contractFactory.dsuToken({ address, network: this.network });
  }
  getAddresses(_params: GetAddressesParams): string[] | Promise<string[]> {
    return ['0x52c64b8998eb7c80b6f526e99e29abdcc86b841b'];
  }
  async getUnderlyingTokenDefinitions() {
    return [{ address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', network: this.network }];
  }
  async getPricePerShare(
    _params: GetPricePerShareParams<DsuToken, DefaultAppTokenDataProps, DefaultAppTokenDefinition>,
  ): Promise<number[]> {
    return [1];
  }
}
