import { Inject, Injectable } from '@nestjs/common';

import { AppTokenPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { CurveContractFactory, CurveV1Pool, CurveV1PoolLegacy } from '../contracts';

import { CurveOnChainReserveStrategy } from './curve.on-chain.reserve-strategy';
import { CurvePoolTokenHelper } from './curve.pool.token-helper';
import { CurveVirtualPriceStrategy } from './curve.virtual.price-strategy';
import { CurvePoolDefinition } from './registry/curve.on-chain.registry';

type CurveStablePoolTokenHelperParams = {
  poolDefinitions: CurvePoolDefinition[];
  network: Network;
  appId: string;
  groupId: string;
  appTokenDependencies?: AppGroupsDefinition[];
  baseCurveTokens?: AppTokenPosition[];
};

@Injectable()
export class CurveStablePoolTokenHelper {
  constructor(
    @Inject(CurvePoolTokenHelper)
    private readonly curvePoolTokenHelper: CurvePoolTokenHelper,
    @Inject(CurveOnChainReserveStrategy)
    private readonly curveOnChainReserveStrategy: CurveOnChainReserveStrategy,
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
    appTokenDependencies = [],
    baseCurveTokens = [],
  }: CurveStablePoolTokenHelperParams) {
    return this.curvePoolTokenHelper.getTokens<CurveV1Pool | CurveV1PoolLegacy>({
      network: network,
      appId: appId,
      groupId: groupId,
      appTokenDependencies,
      baseCurveTokens,
      resolvePoolDefinitions: async () => poolDefinitions,
      resolvePoolContract: ({ network, definition }) =>
        this.curveContractFactory.curveV1Pool({ network, address: definition.swapAddress }),
      resolvePoolTokenContract: ({ network, definition }) =>
        this.curveContractFactory.erc20({ network, address: definition.tokenAddress }),
      resolvePoolReserves: this.curveOnChainReserveStrategy.build(),
      resolvePoolFee: ({ multicall, poolContract }) => multicall.wrap(poolContract).fee(),
      resolvePoolTokenSymbol: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).totalSupply(),
      resolvePoolTokenPrice: this.curveVirtualPriceStrategy.build({
        resolveVirtualPrice: ({ multicall, poolContract }) => multicall.wrap(poolContract).get_virtual_price(),
      }),
    });
  }
}
