import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc4626 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
  GetPricePerShareParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

import { SentimentContractFactory } from '../contracts';

import { SENTIMENT_REGISTRY_ADDRESS } from './sentiment.constants';

@PositionTemplate()
export class ArbitrumSentimentLendingTokenFetcher extends AppTokenTemplatePositionFetcher<Erc4626> {
  groupLabel: string;

  constructor(
    @Inject(APP_TOOLKIT) public readonly appToolkit: IAppToolkit,
    @Inject(SentimentContractFactory) private readonly sentimentContractFactory: SentimentContractFactory,
  ) {
    super(appToolkit);
    this.groupLabel = 'Lending';
  }

  getContract(_address: string): Erc4626 {
    return this.sentimentContractFactory.erc4626({
      address: _address,
      network: this.network,
    });
  }

  async getAddresses(_params: GetAddressesParams<DefaultAppTokenDefinition>): Promise<string[]> {
    const lTokens = await this.sentimentContractFactory
      .sentimentRegistry({
        address: SENTIMENT_REGISTRY_ADDRESS,
        network: this.network,
      })
      .getAllLTokens();
    return lTokens;
  }

  async getUnderlyingTokenDefinitions(
    _params: GetUnderlyingTokensParams<Erc4626, DefaultAppTokenDefinition>,
  ): Promise<UnderlyingTokenDefinition[]> {
    const underlyingAsset = await _params.contract.asset();
    return [
      {
        address: underlyingAsset.toLowerCase(),
        network: this.network,
      },
    ];
  }

  async getPricePerShare({
    address,
    multicall,
    appToken,
  }: GetPricePerShareParams<Erc4626, DefaultAppTokenDataProps, DefaultAppTokenDefinition>): Promise<number[]> {
    const contract = multicall.wrap(
      this.sentimentContractFactory.sentimentLToken({
        address,
        network: this.network,
      }),
    );
    const [totalAssetsRaw, totalSupplyRaw] = await Promise.all([contract.totalAssets(), contract.totalSupply()]);
    const totalAssets = Number(totalAssetsRaw) / 10 ** appToken.tokens[0].decimals;
    const totalSupply = Number(totalSupplyRaw) / 10 ** appToken.tokens[0].decimals;

    return [totalAssets / totalSupply];
  }
}
