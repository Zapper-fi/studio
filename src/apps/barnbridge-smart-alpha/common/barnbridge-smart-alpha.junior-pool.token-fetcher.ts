import { Inject } from '@nestjs/common';
import moment from 'moment';
import 'moment-duration-format';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { BarnbridgeSmartAlphaViemContractFactory } from '../contracts';
import { BarnbridgeSmartAlphaToken } from '../contracts/viem';

export type BarnbridgeSmartAlphaJuniorPoolTokenDefinition = {
  address: string;
  smartPoolAddress: string;
  underlyingTokenAddress: string;
};

export abstract class BarnbridgeSmartAlphaJuniorPoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  BarnbridgeSmartAlphaToken,
  DefaultAppTokenDataProps,
  BarnbridgeSmartAlphaJuniorPoolTokenDefinition
> {
  abstract poolAlphaAddresses: string[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BarnbridgeSmartAlphaViemContractFactory)
    protected readonly contractFactory: BarnbridgeSmartAlphaViemContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<BarnbridgeSmartAlphaJuniorPoolTokenDefinition[]> {
    const poolAlphaPositions = await Promise.all(
      this.poolAlphaAddresses.map(async poolAddress => {
        const poolContract = this.contractFactory.barnbridgeSmartAlphaPool({
          address: poolAddress,
          network: this.network,
        });
        const [juniorAddressRaw, underlyingTokenAddressRaw] = await Promise.all([
          multicall.wrap(poolContract).read.juniorToken(),
          multicall.wrap(poolContract).read.poolToken(),
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

  getContract(address: string) {
    return this.contractFactory.barnbridgeSmartAlphaToken({ network: this.network, address });
  }

  async getAddresses({
    definitions,
  }: GetAddressesParams<BarnbridgeSmartAlphaJuniorPoolTokenDefinition>): Promise<string[]> {
    return definitions.map(x => x.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<BarnbridgeSmartAlphaToken, BarnbridgeSmartAlphaJuniorPoolTokenDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare({
    multicall,
    definition,
  }: GetPricePerShareParams<
    BarnbridgeSmartAlphaToken,
    DefaultAppTokenDataProps,
    BarnbridgeSmartAlphaJuniorPoolTokenDefinition
  >) {
    const alphaPoolContract = this.contractFactory.barnbridgeSmartAlphaPool({
      address: definition.smartPoolAddress,
      network: this.network,
    });

    const pricePerShareRaw = await multicall.wrap(alphaPoolContract).read.estimateCurrentJuniorTokenPrice();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** 18;
    return [pricePerShare];
  }

  async getLabel({
    multicall,
    definition,
    appToken,
  }: GetDisplayPropsParams<
    BarnbridgeSmartAlphaToken,
    DefaultDataProps,
    BarnbridgeSmartAlphaJuniorPoolTokenDefinition
  >): Promise<string> {
    const alphaPoolContract = this.contractFactory.barnbridgeSmartAlphaPool({
      address: definition.smartPoolAddress,
      network: this.network,
    });
    const durationRaw = await multicall.wrap(alphaPoolContract).read.epochDuration();
    const duration = moment.duration(Number(durationRaw), 'seconds').format('w [weeks]');

    return [appToken.tokens[0].symbol, 'Junior Pool', '-', duration].join(' ');
  }
}
