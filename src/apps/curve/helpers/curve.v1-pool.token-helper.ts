import { Inject } from '@nestjs/common';

import { AppTokenPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { CurveContractFactory, CurveV1Pool, CurveV1PoolLegacy } from '../contracts';
import { CurvePoolDefinition } from '../curve.types';

import { CurveApiVolumeStrategy } from './curve.api.volume-strategy';
import { CurveOnChainCoinStrategy } from './curve.on-chain.coin-strategy';
import { CurveOnChainReserveStrategy } from './curve.on-chain.reserve-strategy';
import { CurvePoolTokenHelper } from './curve.pool.token-helper';
import { CurveVirtualPriceStrategy } from './curve.virtual.price-strategy';

type CurveV1PoolTokenHelperParams = {
  poolDefinitions: CurvePoolDefinition[];
  network: Network;
  appId: string;
  groupId: string;
  statsUrl?: string;
  appTokenDependencies?: AppGroupsDefinition[];
  baseCurveTokens?: AppTokenPosition[];
};

export class CurveV1PoolTokenHelper {
  constructor(
    @Inject(CurvePoolTokenHelper)
    private readonly curvePoolTokenHelper: CurvePoolTokenHelper,
    @Inject(CurveOnChainCoinStrategy)
    private readonly curveOnChainCoinStrategy: CurveOnChainCoinStrategy,
    @Inject(CurveOnChainReserveStrategy)
    private readonly curveOnChainReserveStrategy: CurveOnChainReserveStrategy,
    @Inject(CurveApiVolumeStrategy)
    private readonly curveApiVolumeStrategy: CurveApiVolumeStrategy,
    @Inject(CurveVirtualPriceStrategy)
    private readonly curveVirtualPriceStrategy: CurveVirtualPriceStrategy,
    @Inject(CurveContractFactory)
    private readonly curveContractFactory: CurveContractFactory,
  ) {}

  async getTokens({
    network,
    appId,
    groupId,
    poolDefinitions,
    statsUrl = '',
    appTokenDependencies = [],
    baseCurveTokens = [],
  }: CurveV1PoolTokenHelperParams) {
    return this.curvePoolTokenHelper.getTokens<CurveV1Pool | CurveV1PoolLegacy>({
      network: network,
      appId: appId,
      groupId: groupId,
      appTokenDependencies,
      baseCurveTokens,
      resolvePoolDefinitions: async () => poolDefinitions,
      resolvePoolContract: ({ network, definition }) =>
        definition.isLegacy
          ? this.curveContractFactory.curveV1PoolLegacy({ network, address: definition.swapAddress })
          : this.curveContractFactory.curveV1Pool({ network, address: definition.swapAddress }),
      resolvePoolTokenContract: ({ network, definition }) =>
        this.curveContractFactory.erc20({ network, address: definition.tokenAddress }),
      resolvePoolCoinAddresses: this.curveOnChainCoinStrategy.build(),
      resolvePoolReserves: this.curveOnChainReserveStrategy.build(),
      resolvePoolVolume: this.curveApiVolumeStrategy.build({ statsUrl }),
      resolvePoolFee: ({ multicall, poolContract }) => multicall.wrap(poolContract).fee(),
      resolvePoolTokenSymbol: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).totalSupply(),
      resolvePoolTokenPrice: this.curveVirtualPriceStrategy.build({
        resolveVirtualPrice: ({ multicall, poolContract }) => multicall.wrap(poolContract).get_virtual_price(),
      }),
    });
  }
}
