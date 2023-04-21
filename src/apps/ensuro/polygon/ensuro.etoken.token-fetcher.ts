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

import { EnsuroContractFactory, EnsuroEtoken } from '../contracts';
import { EnsuroApiRegistry } from '../common/ensuro.api-registry';

const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

@PositionTemplate()
export class PolygonEnsuroETokenTokenFetcher extends AppTokenTemplatePositionFetcher<EnsuroEtoken> {
  groupLabel = "eTokens";

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(EnsuroApiRegistry) protected readonly ensuroRegistry: EnsuroApiRegistry,
    @Inject(EnsuroContractFactory) private readonly ensuroContractFactory: EnsuroContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(_address: string): EnsuroEtoken {
    return this.ensuroContractFactory.ensuroEtoken({ address: _address, network: this.network });
  }

  async getAddresses(_params: GetAddressesParams<DefaultAppTokenDefinition>): Promise<string[]> {
    const eTokens = await this.ensuroRegistry.getETokenDefinitions({ network: this.network });
    return eTokens.map(etk => etk.address);
  }

  async getUnderlyingTokenDefinitions(
    _params: GetUnderlyingTokensParams<EnsuroEtoken, DefaultAppTokenDefinition>,
  ): Promise<UnderlyingTokenDefinition[]> {
    return [{ address: USDC, network: this.network }];
  }

  async getPricePerShare(
    _params: GetPricePerShareParams<EnsuroEtoken, DefaultAppTokenDataProps, DefaultAppTokenDefinition>,
  ): Promise<number[]> {
    return [1];
  }

  async getApy({ appToken }: GetDataPropsParams<EnsuroEtoken>) {
    return (await this.ensuroRegistry.getETokenApy({ network: this.network, address: appToken.address })) * 100;
  }
}
