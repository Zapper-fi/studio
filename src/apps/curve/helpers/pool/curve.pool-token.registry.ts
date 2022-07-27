import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish, Contract, ethers } from 'ethers';
import _, { range, toLower } from 'lodash';
import moment from 'moment';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import {
  CurveContractFactory,
  CurveCryptoFactory,
  CurveCryptoRegistry,
  CurveFactoryV2,
  CurveStableRegistry,
} from '~apps/curve/contracts';
import { CURVE_DEFINITION } from '~apps/curve/curve.definition';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

import { CurveApiClient } from '../api/curve.api.client';

const ADDRESS_RESOLVER_ADDRESS = '0x0000000022d53366457f9d5e68ec105046fc4383';

export enum CurvePoolType {
  STABLE = 'stable',
  CRYPTO = 'crypto',
  FACTORY_STABLE = 'factory-stable',
  FACTORY_CRYPTO = 'factory-crypto',
}

export const POOL_TYPE_TO_ADDRESS_RESOLVER_INDEX = {
  [CurvePoolType.STABLE]: 0,
  [CurvePoolType.CRYPTO]: 5,
  [CurvePoolType.FACTORY_STABLE]: 3,
  [CurvePoolType.FACTORY_CRYPTO]: 6,
};

export type CurvePoolDefinition = {
  swapAddress: string;
  tokenAddress: string;
  coinAddresses: string[];
  poolType?: CurvePoolType;
  gaugeAddress?: string;
  isMetaPool?: boolean;
  volume?: number;
  apy?: number;
};

@Injectable()
export class CurvePoolTokenRegistry {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) private readonly curveContractFactory: CurveContractFactory,
    @Inject(CurveApiClient) private readonly curveApiClient: CurveApiClient,
  ) {}

  async getGaugesWithType(network: Network) {
    const provider = this.appToolkit.getNetworkProvider(network);
    const gauges = await this.getCachedGauges(network);

    const gaugesWithVersions = await Promise.all(
      gauges.map(async gauge => {
        let bytecode = await provider.getCode(gauge.gaugeAddress);
        const minimalProxyMatch = /0x363d3d373d3d3d363d73(.*)5af43d82803e903d91602b57fd5bf3/.exec(bytecode);
        if (minimalProxyMatch) bytecode = await provider.getCode(`0x${minimalProxyMatch[1]}`);

        const doubleGaugeMethod = ethers.utils.id('rewarded_token()').slice(2, 10);
        const nGaugeMethod = ethers.utils.id('reward_tokens(uint256)').slice(2, 10);

        if (bytecode.includes(doubleGaugeMethod)) return { ...gauge, version: 'double' };
        if (bytecode.includes(nGaugeMethod)) return { ...gauge, version: 'n-gauge' };
        return { ...gauge, version: 'single' };
      }),
    );

    return gaugesWithVersions;
  }

  @Cache({
    instance: 'business',
    key: (network: Network) => `studio:${CURVE_DEFINITION.id}:${network}:pool-definitions`,
    ttl: moment.duration(60, 'minutes').asSeconds(),
  })
  async getPoolDefinitions(network: Network) {
    const poolDefinitionPromises = [
      // Stable Swap Registry
      this.retrieveFromSource<CurveStableRegistry>({
        network,
        poolType: CurvePoolType.STABLE,
        resolveSourceContract: ({ address, network }) =>
          this.curveContractFactory.curveStableRegistry({ address, network }),
        resolveSourceCount: ({ contract }) => contract.pool_count(),
        resolveSwapAddress: ({ contract, index }) => contract.pool_list(index),
        resolveTokenAddress: ({ contract, swapAddress }) => contract.get_lp_token(swapAddress),
        resolveCoinAddresses: ({ contract, swapAddress }) => contract.get_coins(swapAddress),
        resolveIsMetaPool: ({ contract, swapAddress }) => contract.is_meta(swapAddress),
      }),
      // Stable Swap Factory
      this.retrieveFromSource<CurveFactoryV2>({
        network,
        poolType: CurvePoolType.FACTORY_STABLE,
        resolveSourceContract: ({ address, network }) =>
          this.curveContractFactory.curveFactoryPoolV2({ address, network }),
        resolveSourceCount: ({ contract }) => contract.pool_count(),
        resolveSwapAddress: ({ contract, index }) => contract.pool_list(index),
        resolveTokenAddress: ({ swapAddress }) => swapAddress,
        resolveCoinAddresses: ({ contract, swapAddress }) => contract.get_coins(swapAddress),
        resolveIsMetaPool: ({ contract, swapAddress }) => contract.is_meta(swapAddress),
      }),
      // Crypto Swap Registry
      this.retrieveFromSource<CurveCryptoRegistry>({
        network,
        poolType: CurvePoolType.CRYPTO,
        resolveSourceContract: ({ address, network }) =>
          this.curveContractFactory.curveCryptoRegistry({ address, network }),
        resolveSourceCount: ({ contract }) => contract.pool_count(),
        resolveSwapAddress: ({ contract, index }) => contract.pool_list(index),
        resolveTokenAddress: ({ contract, swapAddress }) => contract.get_lp_token(swapAddress),
        resolveCoinAddresses: ({ contract, swapAddress }) => contract.get_coins(swapAddress),
        resolveIsMetaPool: () => false,
      }),
    ];

    if (network === Network.ETHEREUM_MAINNET) {
      poolDefinitionPromises.push(
        // Crypto Swap Factory
        this.retrieveFromSource<CurveCryptoFactory>({
          network,
          poolType: CurvePoolType.FACTORY_CRYPTO,
          resolveSourceContract: ({ address, network }) =>
            this.curveContractFactory.curveCryptoFactory({ address, network }),
          resolveSourceCount: ({ contract }) => contract.pool_count(),
          resolveSwapAddress: ({ contract, index }) => contract.pool_list(index),
          resolveTokenAddress: ({ contract, swapAddress }) => contract.get_token(swapAddress),
          resolveCoinAddresses: ({ contract, swapAddress }) => contract.get_coins(swapAddress),
          resolveIsMetaPool: () => false,
        }),
      );
    }

    const poolDefinitions = await Promise.all(poolDefinitionPromises);
    return _(poolDefinitions)
      .flatten()
      .uniqBy(v => v.swapAddress)
      .value();
  }

  private async retrieveFromSource<T extends Contract>({
    network,
    poolType,
    resolveSourceContract,
    resolveSourceCount,
    resolveSwapAddress,
    resolveTokenAddress,
    resolveCoinAddresses,
    resolveIsMetaPool,
  }: {
    network: Network;
    poolType: CurvePoolType;
    resolveSourceContract: (opts: { address: string; network: Network }) => T;
    resolveSourceCount: (opts: { contract: T }) => BigNumberish | Promise<BigNumberish>;
    resolveSwapAddress: (opts: { contract: T; index: number }) => string | Promise<string>;
    resolveTokenAddress: (opts: { contract: T; swapAddress: string }) => string | Promise<string>;
    resolveCoinAddresses: (opts: { contract: T; swapAddress: string }) => string[] | Promise<string[]>;
    resolveIsMetaPool: (opts: { contract: T; swapAddress: string }) => boolean | Promise<boolean>;
  }) {
    const multicall = this.appToolkit.getMulticall(network);
    const allGauges = await this.getCachedGauges(network);
    const allPoolApyData = await this.getCachedPoolApyData(network);

    const resolver = this.curveContractFactory.curveAddressResolver({ address: ADDRESS_RESOLVER_ADDRESS, network });
    const sourceInfo = await resolver.get_id_info(POOL_TYPE_TO_ADDRESS_RESOLVER_INDEX[poolType]);

    const source = resolveSourceContract({ address: sourceInfo.addr, network });
    const multicallWrappedSource = multicall.wrap(source);
    const poolCount = await resolveSourceCount({ contract: multicallWrappedSource });

    const poolDefinitions = await Promise.all(
      range(0, Number(poolCount)).map(async index => {
        const swapAddressRaw = await resolveSwapAddress({ contract: multicallWrappedSource, index });
        const swapAddress = swapAddressRaw.toLowerCase();

        const tokenAddressRaw = await resolveTokenAddress({ contract: multicallWrappedSource, swapAddress });
        const tokenAddress = tokenAddressRaw.toLowerCase();

        const isMetaPool = await resolveIsMetaPool({ contract: multicallWrappedSource, swapAddress });
        const coinAddressesRaw = await resolveCoinAddresses({ contract: multicallWrappedSource, swapAddress });
        const coinAddresses = coinAddressesRaw
          .filter(v => v !== ZERO_ADDRESS)
          .map(v => v.replace(ETH_ADDR_ALIAS, ZERO_ADDRESS))
          .map(toLower);

        const gauge = allGauges.find(v => v.swapAddress === swapAddress);
        const gaugeAddress = gauge?.gaugeAddress ?? ZERO_ADDRESS;

        const poolApyData = allPoolApyData.find(v => v.swapAddress === swapAddress);
        const apy = poolApyData?.apy ?? 0;
        const volume = poolApyData?.volume ?? 0;

        const definition: CurvePoolDefinition = {
          poolType,
          swapAddress,
          tokenAddress,
          coinAddresses,
          isMetaPool,
          gaugeAddress,
          apy,
          volume,
        };

        return definition;
      }),
    );

    return poolDefinitions;
  }

  @Cache({
    instance: 'business',
    key: (network: Network) => `studio:${CURVE_DEFINITION.id}:${network}:gauge-data`,
    ttl: moment.duration(60, 'minutes').asSeconds(),
  })
  private async getCachedGauges(network: Network) {
    return this.curveApiClient.getGauges(network);
  }

  @Cache({
    instance: 'business',
    key: (network: Network) => `studio:${CURVE_DEFINITION.id}:${network}:pool-apy-data:2`,
    ttl: moment.duration(60, 'minutes').asSeconds(),
  })
  private async getCachedPoolApyData(network: Network) {
    return this.curveApiClient.getPoolApyData(network);
  }
}
