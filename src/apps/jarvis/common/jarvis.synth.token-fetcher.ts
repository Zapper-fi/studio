import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetDefinitionsParams,
  DefaultAppTokenDataProps,
  GetPriceParams,
} from '~position/template/app-token.template.types';

import { JarvisViemContractFactory } from '../contracts';
import { JarvisSynth } from '../contracts/viem';

type JarvisSynthDefinition = {
  address: string;
  poolAddress: string;
};

export abstract class JarvisSynthTokenFetcher extends AppTokenTemplatePositionFetcher<
  JarvisSynth,
  DefaultAppTokenDataProps,
  JarvisSynthDefinition
> {
  abstract poolAddresses: string[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(JarvisViemContractFactory) protected readonly contractFactory: JarvisViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.jarvisSynth({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<JarvisSynthDefinition[]> {
    const definitions = await Promise.all(
      this.poolAddresses.map(async poolAddress => {
        const poolContract = this.contractFactory.jarvisSynthereumLiquidityPool({
          address: poolAddress,
          network: this.network,
        });

        const synthAddress = await multicall.wrap(poolContract).read.syntheticToken();
        return { address: synthAddress, poolAddress };
      }),
    );

    return definitions;
  }

  async getAddresses({ definitions }: GetAddressesParams<JarvisSynthDefinition>) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions() {
    return [];
  }

  async getPricePerShare() {
    return [1];
  }

  async getPrice({
    definition,
    multicall,
  }: GetPriceParams<JarvisSynth, DefaultAppTokenDataProps, JarvisSynthDefinition>) {
    const poolContract = this.contractFactory.jarvisSynthereumLiquidityPool({
      address: definition.poolAddress,
      network: this.network,
    });

    const finderAddress = await multicall.wrap(poolContract).read.synthereumFinder();
    const finder = this.contractFactory.jarvisSynthereumFinder({ address: finderAddress, network: this.network });

    const priceFeedName = ethers.utils.formatBytes32String('PriceFeed');
    const priceFeedAddress = await finder.read.getImplementationAddress([priceFeedName]);
    const priceFeed = this.contractFactory.jarvisSynthereumPriceFeed({
      address: priceFeedAddress,
      network: this.network,
    });

    // Multicall crashes for some reason
    const priceFeedIdentifier = await multicall.wrap(poolContract).read.priceFeedIdentifier();
    const priceRaw = await priceFeed.read.getLatestPrice([priceFeedIdentifier]).catch(() => 0);

    return Number(priceRaw) / 10 ** 18;
  }
}
