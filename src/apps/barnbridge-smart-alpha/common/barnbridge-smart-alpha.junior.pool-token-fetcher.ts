import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPriceParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { BarnbridgeSmartAlphaContractFactory, BarnbridgeSmartAlphaToken } from '../contracts';

export type BarnbridgeSmartAlphaJuniorPoolTokenDefinition = {
  address: string;
  smartPoolAddress: string;
  underlyingTokenAddress: string;
};

export abstract class BarnbridgeSmartAlphaJuniorPoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  BarnbridgeSmartAlphaToken,
  DefaultDataProps,
  BarnbridgeSmartAlphaJuniorPoolTokenDefinition
> {
  abstract poolAlphaAddresses: string[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BarnbridgeSmartAlphaContractFactory)
    protected readonly contractFactory: BarnbridgeSmartAlphaContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions({ multicall }): Promise<BarnbridgeSmartAlphaJuniorPoolTokenDefinition[]> {
    const poolAlphaPositions = await Promise.all(
      this.poolAlphaAddresses.map(async poolAddress => {
        const poolContract = this.contractFactory.barnbridgeSmartAlphaPool({
          address: poolAddress,
          network: this.network,
        });
        const [juniorAddressRaw, underlyingTokenAddressRaw] = await Promise.all([
          multicall.wrap(poolContract).juniorToken(),
          multicall.wrap(poolContract).poolToken(),
        ]);

        return {
          address: juniorAddressRaw.toLowerCase(),
          underlyingTokenAddress: underlyingTokenAddressRaw.toLowerCase(),
          smartPoolAddress: poolAddress,
        };
      }),
    );

    return poolAlphaPositions;
  }

  getContract(address: string): BarnbridgeSmartAlphaToken {
    return this.contractFactory.barnbridgeSmartAlphaToken({ network: this.network, address });
  }

  async getAddresses({
    definitions,
  }: GetAddressesParams<BarnbridgeSmartAlphaJuniorPoolTokenDefinition>): Promise<string[]> {
    return definitions.map(x => x.address);
  }

  async getUnderlyingTokenAddresses({
    definition,
  }: GetUnderlyingTokensParams<BarnbridgeSmartAlphaToken, BarnbridgeSmartAlphaJuniorPoolTokenDefinition>) {
    return [definition.underlyingTokenAddress];
  }

  async getPrice({
    multicall,
    definition,
    appToken,
  }: GetPriceParams<
    BarnbridgeSmartAlphaToken,
    DefaultDataProps,
    BarnbridgeSmartAlphaJuniorPoolTokenDefinition
  >): Promise<number> {
    const alphaPoolContract = this.contractFactory.barnbridgeSmartAlphaPool({
      address: definition.smartPoolAddress,
      network: this.network,
    });
    const juniorTokenPriceInUnderlyingRaw = await multicall.wrap(alphaPoolContract).estimateCurrentJuniorTokenPrice();
    const juniorTokenPriceInUnderlying = Number(juniorTokenPriceInUnderlyingRaw) / 10 ** 18;
    return Number(juniorTokenPriceInUnderlying) * appToken.tokens[0].price;
  }

  async getLabel({ appToken }: GetDisplayPropsParams<BarnbridgeSmartAlphaToken>): Promise<string> {
    const lowerBoundIndex = appToken.symbol.lastIndexOf('-') + 1;
    const upperBoundIndex = appToken.symbol.lastIndexOf('w');
    const duration = appToken.symbol.substring(lowerBoundIndex, upperBoundIndex);
    const durationLabel = Number(duration) < 2 ? 'week' : 'weeks';
    return [appToken.tokens[0].symbol, 'Junior Pool', '-', duration, durationLabel].join(' ');
  }

  async getDataProps({ appToken }: GetDataPropsParams<BarnbridgeSmartAlphaToken, DefaultDataProps>) {
    const liquidity = appToken.supply * appToken.price;
    return { liquidity };
  }
}
