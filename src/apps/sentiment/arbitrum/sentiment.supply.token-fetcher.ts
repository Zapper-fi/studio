import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { SentimentViemContractFactory } from '../contracts';
import { SentimentLToken } from '../contracts/viem';

export type SentimentSupplyAppTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

@PositionTemplate()
export class ArbitrumSentimentSupplyTokenFetcher extends AppTokenTemplatePositionFetcher<
  SentimentLToken,
  DefaultAppTokenDataProps,
  SentimentSupplyAppTokenDefinition
> {
  groupLabel = 'Supply';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SentimentViemContractFactory) protected readonly contractFactory: SentimentViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.sentimentLToken({ network: this.network, address });
  }

  async getDefinitions(): Promise<SentimentSupplyAppTokenDefinition[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const registryContract = this.contractFactory.sentimentRegistry({
      address: '0x17b07cfbab33c0024040e7c299f8048f4a49679b',
      network: this.network,
    });
    const marketAddressRaw = await multicall.wrap(registryContract).read.getAllLTokens();

    const definitions = await Promise.all(
      marketAddressRaw.map(async address => {
        const lTokenContract = this.contractFactory.sentimentLToken({ address, network: this.network });
        const underlyingTokenAddressRaw = await multicall.wrap(lTokenContract).read.asset();
        return {
          address,
          underlyingTokenAddress: underlyingTokenAddressRaw,
        };
      }),
    );

    return definitions;
  }

  async getAddresses({ definitions }: GetAddressesParams) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<SentimentLToken, SentimentSupplyAppTokenDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<SentimentLToken>) {
    const decimals = appToken.tokens[0].decimals;
    const oneUnit = ethers.BigNumber.from(10).pow(decimals).toString();
    const pricePerShareRaw = await contract.read.convertToAssets([BigInt(oneUnit)]);
    const pricePerShare = Number(pricePerShareRaw) / 10 ** decimals;

    return [pricePerShare];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<SentimentLToken>): Promise<string> {
    return getLabelFromToken(appToken.tokens[0]);
  }
}
