import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish, Contract, ethers } from 'ethers';
import { partition, range, uniqBy } from 'lodash';
import moment from 'moment';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import {
  CurveContractFactory,
  CurveCryptoFactory,
  CurveCryptoRegistry,
  CurveStableFactory,
  CurveStableRegistry,
} from '~apps/curve/contracts';
import { CURVE_DEFINITION } from '~apps/curve/curve.definition';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

import { CurveApiClient } from './curve.api.client';
import { CurveGaugeRegistry } from './curve.gauge.registry';

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
  gaugeAddresses?: string[];
  poolType?: CurvePoolType;
  isMetaPool?: boolean;
  volume?: number;
  apy?: number;
  isLegacy?: boolean;
};

@Injectable()
export class CurvePoolRegistry {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) private readonly curveContractFactory: CurveContractFactory,
    @Inject(CurveApiClient) private readonly curveApiClient: CurveApiClient,
    @Inject(CurveGaugeRegistry) private readonly curveGaugeRegistry: CurveGaugeRegistry,
  ) {}

  @Cache({
    instance: 'business',
    key: (network: Network) => `studio:${CURVE_DEFINITION.id}:${network}:pool-definitions:0`,
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
      }),
      // Stable Swap Factory
      this.retrieveFromSource<CurveStableFactory>({
        network,
        poolType: CurvePoolType.FACTORY_STABLE,
        resolveSourceContract: ({ address, network }) =>
          this.curveContractFactory.curveStableFactory({ address, network }),
        resolveSourceCount: ({ contract }) => contract.pool_count(),
        resolveSwapAddress: ({ contract, index }) => contract.pool_list(index),
        resolveTokenAddress: ({ swapAddress }) => swapAddress,
        resolveCoinAddresses: ({ contract, swapAddress }) => contract.get_coins(swapAddress),
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
        }),
      );
    }

    const provider = this.appToolkit.getNetworkProvider(network);
    const poolDefinitions = await Promise.all(poolDefinitionPromises).then(v => v.flat());
    const poolDefinitionsWithLegacy = await Promise.all(
      poolDefinitions.map(async poolDefinition => {
        if (network !== Network.ETHEREUM_MAINNET) return poolDefinition;
        if ([CurvePoolType.FACTORY_STABLE, CurvePoolType.FACTORY_CRYPTO].includes(poolDefinition.poolType!))
          return poolDefinition;

        const code = await provider.getCode(poolDefinition.swapAddress);
        const legacyMethod = ethers.utils.id('balances(int128)').slice(2, 10);

        const isLegacy = code.includes(legacyMethod);
        if (isLegacy) return { ...poolDefinition, isLegacy: true };

        const crypotPoolMethod = ethers.utils.id('D()').slice(2, 10);
        const realPoolType = code.includes(crypotPoolMethod) ? CurvePoolType.CRYPTO : CurvePoolType.STABLE;
        return { ...poolDefinition, poolType: realPoolType };
      }),
    );

    const [metaPools, basePools] = partition(poolDefinitionsWithLegacy, v =>
      v.coinAddresses.some(t => poolDefinitionsWithLegacy.find(p => p.tokenAddress === t)),
    );

    const poolDefinitionsWithMeta = [
      ...metaPools.map(v => ({ ...v, isMetaPool: true })),
      ...basePools.map(v => ({ ...v, isMetaPool: false })),
    ];

    return uniqBy(poolDefinitionsWithMeta, v => v.swapAddress);
  }

  private async retrieveFromSource<T extends Contract>({
    network,
    poolType,
    resolveSourceContract,
    resolveSourceCount,
    resolveSwapAddress,
    resolveTokenAddress,
    resolveCoinAddresses,
  }: {
    network: Network;
    poolType: CurvePoolType;
    resolveSourceContract: (opts: { address: string; network: Network }) => T;
    resolveSourceCount: (opts: { contract: T }) => BigNumberish | Promise<BigNumberish>;
    resolveSwapAddress: (opts: { contract: T; index: number }) => string | Promise<string>;
    resolveTokenAddress: (opts: { contract: T; swapAddress: string }) => string | Promise<string>;
    resolveCoinAddresses: (opts: { contract: T; swapAddress: string }) => string[] | Promise<string[]>;
  }) {
    const multicall = this.appToolkit.getMulticall(network);
    const gauges = await this.curveGaugeRegistry.getCachedGauges(network);
    const allPoolApyData = await this.getCachedPoolApyData(network);

    const resolver = this.curveContractFactory.curveAddressResolver({ address: ADDRESS_RESOLVER_ADDRESS, network });
    const sourceInfo = await resolver.get_id_info(POOL_TYPE_TO_ADDRESS_RESOLVER_INDEX[poolType]);
    if (sourceInfo.addr === ZERO_ADDRESS) return [];

    const source = resolveSourceContract({ address: sourceInfo.addr, network });
    const multicallWrappedSource = multicall.wrap(source);
    const poolCount = await resolveSourceCount({ contract: multicallWrappedSource });

    const poolDefinitions = await Promise.all(
      range(0, Number(poolCount)).map(async index => {
        const swapAddressRaw = await resolveSwapAddress({ contract: multicallWrappedSource, index });
        const swapAddress = swapAddressRaw.toLowerCase();

        const tokenAddressRaw = await resolveTokenAddress({ contract: multicallWrappedSource, swapAddress });
        const tokenAddress = tokenAddressRaw.toLowerCase();

        const coinAddressesRaw = await resolveCoinAddresses({ contract: multicallWrappedSource, swapAddress });
        const coinAddresses = coinAddressesRaw
          .filter(v => v !== ZERO_ADDRESS)
          .map(v => v.toLowerCase())
          .map(v => v.replace(ETH_ADDR_ALIAS, ZERO_ADDRESS));

        const gaugeAddresses = gauges.filter(v => v.swapAddress === swapAddress).map(v => v.gaugeAddress);
        const poolApyData = allPoolApyData.find(v => v.swapAddress === swapAddress);
        const apy = poolApyData?.apy ?? 0;
        const volume = poolApyData?.volume ?? 0;

        const definition: CurvePoolDefinition = {
          poolType,
          swapAddress,
          tokenAddress,
          gaugeAddresses,
          coinAddresses,
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
    key: (network: Network) => `studio:${CURVE_DEFINITION.id}:${network}:pool-apy-data:2`,
    ttl: moment.duration(60, 'minutes').asSeconds(),
  })
  private async getCachedPoolApyData(network: Network) {
    return this.curveApiClient.getPoolApyData(network);
  }
}
